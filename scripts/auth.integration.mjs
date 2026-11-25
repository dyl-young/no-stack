import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { test } from "node:test";
import { setTimeout } from "node:timers/promises";
import { promisify } from "node:util";

import { startLocalGoogle } from "./local-google.mjs";

const exec = promisify(execFile);
async function startDatabase(cleanups) {
  const { stdout } = await exec("docker", [
    "run",
    "--rm",
    "-d",
    "-p",
    "127.0.0.1::5432",
    "-e",
    "POSTGRES_PASSWORD=test",
    "postgres:16",
  ]);
  const id = stdout.trim();
  cleanups.push(() => exec("docker", ["stop", id]));
  const { stdout: port } = await exec("docker", ["port", id, "5432/tcp"]);
  const url = "postgres://postgres:test@" + port.trim() + "/postgres";
  for (let i = 0; i < 60; i++) {
    try {
      await exec("docker", [
        "exec",
        id,
        "pg_isready",
        "-h",
        "127.0.0.1",
        "-U",
        "postgres",
      ]);
      break;
    } catch {
      await setTimeout(250);
    }
  }
  await exec("pnpm", ["db:migrate"], {
    env: { ...process.env, POSTGRES_URL: url },
  });
  return {
    url,
    sql: async (query) =>
      (
        await exec("docker", [
          "exec",
          id,
          "psql",
          "-U",
          "postgres",
          "-Atc",
          query,
        ])
      ).stdout.trim(),
  };
}
async function startService(cleanups, database) {
  const probe = createServer().listen(0, "127.0.0.1");
  await once(probe, "listening");
  const { port } = probe.address();
  await new Promise((resolve) => probe.close(resolve));
  const origin = "http://127.0.0.1:" + port;
  const service = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "apps/nextjs",
      "-H",
      "127.0.0.1",
      "-p",
      String(port),
    ],
    {
      env: {
        ...process.env,
        NODE_ENV: "development",
        APP_ORIGIN: origin,
        POSTGRES_URL: database,
        LOCAL_GOOGLE_AUTH: "1",
        GOOGLE_WEB_CLIENT_ID: "local-demo",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: "inherit",
    },
  );
  cleanups.push(async () => {
    if (service.exitCode !== null || service.signalCode) return;
    const exited = once(service, "exit");
    service.kill();
    await exited;
  });
  for (let i = 0; i < 100; i++) {
    if (service.exitCode !== null)
      throw new Error("Next exited before serving");
    if ((await fetch(origin + "/api/health").catch(() => null))?.ok)
      return origin;
    await setTimeout(100);
  }
  throw new Error("Next did not become healthy");
}

test("verified Google identities create revocable PostgreSQL sessions on web and native", async (t) => {
  const cleanups = [];
  t.after(async () => {
    for (const cleanup of cleanups.reverse()) await cleanup();
  });
  const database = await startDatabase(cleanups);
  const { server, sign } = await startLocalGoogle();
  cleanups.push(() => new Promise((resolve) => server.close(resolve)));
  const origin = await startService(cleanups, database.url);
  const bearer = (token) => ({ authorization: "Bearer " + token });
  const session = (idToken, source = origin) =>
    fetch(origin + "/api/session", {
      method: "POST",
      headers: { origin: source, "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  const mobile = async (token) => {
    const response = await fetch(origin + "/api/session", {
      method: "POST",
      headers: bearer(token),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("set-cookie"), null);
    return (await response.json()).token;
  };
  const me = (headers) => fetch(origin + "/api/trpc/account.me", { headers });
  const profile = async (headers) =>
    (await (await me(headers)).json()).result.data.json;
  const remove = (headers) =>
    fetch(origin + "/api/trpc/account.remove", {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: "{}",
    });
  const alice = await sign("alice");
  const bob = await sign("bob");
  assert.equal((await me({})).status, 401);
  assert.equal((await session(alice, "https://other.example")).status, 403);
  assert.equal((await session("invalid")).status, 401);
  assert.equal(
    (await session(await sign("alice", "another-client"))).status,
    401,
  );
  assert.equal(
    (await session(await sign("alice", "local-demo", "-1s"))).status,
    401,
  );
  assert.equal((await me(bearer(alice))).status, 401);
  const web = await session(alice);
  assert.equal(web.status, 204);
  const header = web.headers.get("set-cookie");
  assert.match(header, /HttpOnly/i);
  assert.match(header, /SameSite=lax/i);
  const cookie = header.split(";")[0];
  const aliceNative = await mobile(alice);
  const bobNative = await mobile(bob);
  const account = await profile({ cookie });
  assert.equal(account.email, "alice@example.test");
  assert.equal((await profile(bearer(aliceNative))).id, account.id);
  assert.notEqual((await profile(bearer(bobNative))).id, account.id);
  assert.equal((await remove({ cookie })).status, 403);
  const html = await (
    await fetch(origin + "/dashboard/account", { headers: { cookie } })
  ).text();
  const action = html.match(
    /name="(\$ACTION_ID_[^"]+)"[^]*?<button>Sign out<\/button>/,
  )?.[1];
  assert.ok(action);
  const data = new FormData();
  data.append(action, "");
  const logout = await fetch(origin + "/dashboard/account", {
    method: "POST",
    headers: { cookie, origin },
    body: data,
    redirect: "manual",
  });
  assert.equal(logout.status, 303);
  assert.equal((await me({ cookie })).status, 401);
  const logoutNative = await fetch(origin + "/api/session", {
    method: "DELETE",
    headers: bearer(aliceNative),
  });
  assert.equal(logoutNative.status, 204);
  assert.equal((await me(bearer(aliceNative))).status, 401);
  const switched = (await session(bob)).headers.get("set-cookie").split(";")[0];
  assert.equal((await profile({ cookie: switched })).name, "bob");
  assert.equal((await remove({ cookie: switched, origin })).status, 200);
  assert.equal((await me({ cookie: switched })).status, 401);
  assert.equal((await me(bearer(bobNative))).status, 401);
  assert.equal(await database.sql("SELECT count(*) FROM sessions"), "0");
  const restored = await mobile(alice);
  assert.equal((await profile(bearer(restored))).id, account.id);
  const hash = await database.sql("SELECT token_hash FROM sessions");
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.notEqual(hash, restored);
  await database.sql(
    "UPDATE sessions SET expires_at=now() - interval '1 second'",
  );
  assert.equal((await me(bearer(restored))).status, 401);
});
