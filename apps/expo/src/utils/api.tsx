import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@no-stack/api";

import { apiOrigin } from "./auth";
import { useSession } from "./session";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const { TRPCProvider: TRPCInnerProvider, useTRPC } =
  createTRPCContext<AppRouter>();

export const TRPCProvider = (props: { children: React.ReactNode }) => {
  const { token, clear } = useSession();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: apiOrigin + "/api/trpc",
          headers: () => (token ? { authorization: "Bearer " + token } : {}),
          async fetch(input, init) {
            const response = await fetch(input, init);
            if (response.status === 401 && token) await clear(token);
            return response;
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
