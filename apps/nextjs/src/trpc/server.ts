import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@no-stack/api";

import { createAdminClient, createClient } from "~/utils/supabase/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  const supabase = await createClient();
  const supabaseAdminServerClient = createAdminClient();

  return createTRPCContext({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Supabase SDK generic variance mismatch
    supabase,
    supabaseAdminServerClient,
    headers: heads,
  });
});

export const api = createCaller(createContext);
