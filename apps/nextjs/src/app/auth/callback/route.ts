import { NextResponse } from "next/server";

import { createClient } from "~/utils/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (code) {
    const client = await createClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/dashboard", url));
  }
  return NextResponse.redirect(new URL("/auth/error", url));
}
