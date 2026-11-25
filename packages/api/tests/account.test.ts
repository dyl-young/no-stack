import assert from "node:assert/strict";
import { test } from "node:test";

import { appRouter } from "../src/root";

void test("anonymous access is rejected before deletion", async () => {
  const caller = appRouter.createCaller({
    account: null,
    deleteIdentity: () => Promise.reject(new Error("unexpected delete")),
  });
  await assert.rejects(caller.account.me(), { code: "UNAUTHORIZED" });
  await assert.rejects(caller.account.remove(), { code: "UNAUTHORIZED" });
});

void test("each caller reads and deletes only their verified account", async () => {
  const deletes: string[] = [];
  for (const id of ["alice", "bob"]) {
    const account = { id, name: id, email: null, avatarUrl: null };
    const caller = appRouter.createCaller({
      account,
      deleteIdentity: (userId) => {
        deletes.push(userId);
        return Promise.resolve();
      },
    });
    assert.deepEqual(await caller.account.me(), account);
    await caller.account.remove();
  }
  assert.deepEqual(deletes, ["alice", "bob"]);
});

void test("failed deletion is reported to the caller", async () => {
  const caller = appRouter.createCaller({
    account: { id: "alice", name: "Alice", email: null, avatarUrl: null },
    deleteIdentity: () => Promise.reject(new Error("provider unavailable")),
  });
  await assert.rejects(caller.account.remove(), /provider unavailable/);
});
