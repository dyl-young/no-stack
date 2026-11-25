import type { NextRequest } from "next/server";

import { updateSession } from "~/utils/supabase/middleware";

export function proxy(req: NextRequest) {
  return updateSession(req);
}
export const config = { matcher: ["/dashboard/:path*", "/auth/signin"] };
