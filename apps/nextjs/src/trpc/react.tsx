"use client";

import type { TRPCLink } from "@trpc/client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@no-stack/api";

import { toast } from "~/components/ui/sonner";
import { env } from "~/env";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
    },
  });

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // Global error notifier for batched tRPC responses
        (() => {
          const getErrorCode = (err: unknown): string | undefined => {
            if (typeof err !== "object" || err === null) return undefined;
            const record = err as Record<string, unknown>;
            if (typeof record.code === "string") return record.code;
            const data = record.data as Record<string, unknown> | undefined;
            if (typeof data?.code === "string") return data.code;
            const shape = record.shape as Record<string, unknown> | undefined;
            const shapeData = shape?.data as
              | Record<string, unknown>
              | undefined;
            if (typeof shapeData?.code === "string") return shapeData.code;
            return undefined;
          };

          const getErrorMessage = (err: unknown): string => {
            if (err instanceof Error) return err.message;
            if (
              typeof err === "object" &&
              err !== null &&
              "message" in err &&
              typeof (err as Record<string, unknown>).message === "string"
            ) {
              return (err as { message: string }).message;
            }
            return "Unknown error";
          };

          const isUnauthorizedError = (err: unknown): boolean => {
            const message = getErrorMessage(err);
            const code = getErrorCode(err);
            return (
              message.includes("UNAUTHORIZED") ||
              message.includes("401") ||
              code === "UNAUTHORIZED"
            );
          };

          const link: TRPCLink<AppRouter> =
            () =>
            ({ op, next }) =>
              observable((observer) => {
                return next(op).subscribe({
                  next(value) {
                    if (op.type === "mutation" && "error" in value.result) {
                      const result = value.result as { error?: unknown };
                      const description =
                        getErrorMessage(result.error) || "Unknown error";

                      toast.error(description, { duration: 7000 });
                    }

                    observer.next(value);
                  },
                  error(err) {
                    const unauthorized = isUnauthorizedError(err);

                    // Suppress UNAUTHORIZED errors on queries — expected when not logged in
                    if (unauthorized && op.type === "query") {
                      observer.complete();
                      return;
                    }

                    if (op.type === "mutation") {
                      const operationName = op.path.split(".").pop() ?? op.path;
                      const rawMsg = getErrorMessage(err);
                      let errorMsg: string;

                      if (rawMsg.includes("fetch")) {
                        errorMsg =
                          "Network error: Please check your connection and try again.";
                      } else if (rawMsg.includes("timeout")) {
                        errorMsg =
                          "Request timed out: Please try again or contact support.";
                      } else if (rawMsg.includes("404")) {
                        errorMsg =
                          "Service not found: Please refresh the page and try again.";
                      } else if (rawMsg.includes("500")) {
                        errorMsg = "Server error: Please try again later.";
                      } else if (unauthorized) {
                        errorMsg = "Authentication error: Please log in again.";
                      } else {
                        errorMsg = `${operationName} failed: ${rawMsg}`;
                      }

                      toast.error(errorMsg, { duration: 8000 });
                    } else if (!unauthorized) {
                      toast.error(`Network error: ${getErrorMessage(err)}`);
                    }
                    observer.error(err);
                  },
                  complete() {
                    observer.complete();
                  },
                });
              });

          return link;
        })(),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
