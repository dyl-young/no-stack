import type { NextRequest } from "next/server";

import { updateSession } from "~/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Match all routes except static files, Next.js internals, and the health check endpoint
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
