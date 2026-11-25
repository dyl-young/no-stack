import type { AccountContext } from "@no-stack/api";

import { authConfig, isEmailAllowed } from "~/env";

export const sessionSeconds = 60 * 60 * 24 * 5;

export function sessionCookie() {
  const secure = authConfig().origin.startsWith("https:");
  return {
    name: secure ? "__Host-session" : "session",
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function verifiedContext(token?: string): Promise<AccountContext> {
  const store = await import("@no-stack/db/auth");
  const account =
    token && /^[A-Za-z0-9_-]{43}$/.test(token)
      ? await store.sessionAccount(token)
      : null;
  return {
    account: account && isEmailAllowed(account.email) ? account : null,
    deleteIdentity: store.deleteAccount,
  };
}
