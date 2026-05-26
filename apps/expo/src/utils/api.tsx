import { useState } from "react";
import Constants from "expo-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@no-stack/api";

import { useSupabaseClient } from "./session";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const { TRPCProvider: TRPCInnerProvider, useTRPC } =
  createTRPCContext<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@no-stack/api";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.EXPO_PUBLIC_BASE_URL;
  }

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   */

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    return process.env.EXPO_PUBLIC_BASE_URL;
  }
  return `http://${localhost}:3000`;
};

export const generateAPIUrl = (relativePath: string) => {
  const baseUrl = getBaseUrl();
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  if (!baseUrl) {
    throw new Error("Base URL could not be determined.");
  }

  return baseUrl.concat(path);
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const TRPCProvider = (props: { children: React.ReactNode }) => {
  const supabase = useSupabaseClient();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
          // Use console.log for errors to avoid triggering LogBox
          console: {
            log: console.log,
            error: console.log,
          },
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");

            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            if (token) headers.set("authorization", token);

            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCInnerProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCInnerProvider>
    </QueryClientProvider>
  );
};
