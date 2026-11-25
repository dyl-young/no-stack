import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authConfig } from "~/env";
import { googleProfile } from "~/utils/google";
import { sessionCookie, sessionSeconds } from "~/utils/session";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  let idToken: string;
  if (authorization !== null) {
    // Native clients exchange an explicit Google credential and never receive a cookie.
    if (!/^Bearer \S+$/i.test(authorization))
      return new Response(null, { status: 401 });
    idToken = authorization.slice(7);
  } else {
    if (request.headers.get("origin") !== authConfig().origin)
      return new Response(null, { status: 403 });
    if (request.headers.get("content-type") !== "application/json")
      return new Response(null, { status: 415 });
    const body: unknown = await request.json().catch(() => null);
    if (
      !body ||
      typeof body !== "object" ||
      !("idToken" in body) ||
      typeof body.idToken !== "string"
    )
      return new Response(null, { status: 400 });
    idToken = body.idToken;
  }
  const profile = await googleProfile(idToken);
  if (!profile) return new Response(null, { status: 401 });
  const cookie = sessionCookie();
  const store = await import("@no-stack/db/auth");
  const token = await store.issueSession(
    profile,
    new Date(Date.now() + sessionSeconds * 1000),
    authorization ? undefined : request.cookies.get(cookie.name)?.value,
  );
  const headers = { "Cache-Control": "no-store" };
  if (authorization) return Response.json({ token }, { headers });
  const response = new NextResponse(null, { status: 204, headers });
  response.cookies.set({ ...cookie, value: token, maxAge: sessionSeconds });
  return response;
}

export async function DELETE(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization || !/^Bearer \S+$/i.test(authorization))
    return new Response(null, { status: 401 });
  const store = await import("@no-stack/db/auth");
  await store.revokeSession(authorization.slice(7));
  return new Response(null, { status: 204 });
}
