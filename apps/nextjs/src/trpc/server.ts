import { cache } from "react";

import type { AccountContext } from "@no-stack/api";
import { appRouter } from "@no-stack/api";

import { createAdminClient, createClient } from "~/utils/supabase/server";

export async function createContext(token?: string): Promise<AccountContext> {
  const client = await createClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error?.status && error.status >= 500) throw error;
  const metadata: Record<string, unknown> = user?.user_metadata ?? {};
  return {
    account: user
      ? {
          id: user.id,
          email: user.email ?? null,
          name:
            typeof metadata.full_name === "string"
              ? metadata.full_name
              : (user.email ?? "Account"),
          avatarUrl:
            typeof metadata.avatar_url === "string" &&
            metadata.avatar_url.startsWith("https://")
              ? metadata.avatar_url
              : null,
        }
      : null,
    async deleteIdentity(id) {
      const result = await createAdminClient().auth.admin.deleteUser(id, false);
      if (result.error) throw result.error;
    },
  };
}
export const getCaller = cache(async () =>
  appRouter.createCaller(await createContext()),
);
