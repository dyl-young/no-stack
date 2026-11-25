"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { authConfig } from "~/env";
import { getCaller } from "~/trpc/server";
import { sessionCookie } from "~/utils/session";

async function checkOrigin() {
  if ((await headers()).get("origin") !== authConfig().origin)
    throw new Error("Invalid origin");
}

export async function signOut() {
  await checkOrigin();
  const jar = await cookies();
  const cookie = sessionCookie();
  const token = jar.get(cookie.name)?.value;
  if (token) await (await import("@no-stack/db/auth")).revokeSession(token);
  jar.set({ ...cookie, value: "", maxAge: 0 });
  redirect("/auth/signin");
}
export async function deleteAccount() {
  await checkOrigin();
  const caller = await getCaller();
  try {
    await caller.account.remove();
  } catch {
    redirect("/dashboard/account?failed=1");
  }
  await signOut();
}
