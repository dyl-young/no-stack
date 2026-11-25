"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCaller } from "~/trpc/server";
import { createClient } from "~/utils/supabase/server";

export async function signInWithGoogle() {
  const origin = (await headers()).get("origin");
  if (!origin) redirect("/auth/error");
  const client = await createClient();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: new URL("/auth/callback", origin).href },
  });
  if (error) redirect("/auth/error");
  redirect(data.url);
}
export async function signOut() {
  const client = await createClient();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) throw error;
  redirect("/auth/signin");
}
export async function deleteAccount() {
  const caller = await getCaller();
  try {
    await caller.account.remove();
  } catch {
    redirect("/dashboard/account?failed=1");
  }
  await signOut();
}
