import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { appRouter } from "@no-stack/api";

import { env } from "@/env";

export async function GET(_req: Request | NextRequest) {
  if (env.NODE_ENV === "development") {
    // Dynamic import to avoid bundling emotion/mui dependencies at build time
    const { renderTrpcPanel } = await import("trpc-ui");

    return new NextResponse(
      renderTrpcPanel(appRouter, {
        url: `/api/trpc`,
        transformer: "superjson",
        meta: {
          title: "no-stack API",
          description:
            "tRPC API Explorer. Log in in the main app to use auth protected routes. Your session is shared between the main app and the API explorer.",
        },
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  }
  return new NextResponse(null, { status: 404 });
}
