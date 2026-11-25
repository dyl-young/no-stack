import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@no-stack/api";

import { authConfig } from "~/env";
import { cookieContext } from "~/trpc/server";
import { verifiedContext } from "~/utils/session";

function handler(req: Request) {
  const authorization = req.headers.get("authorization");
  if (authorization !== null && !/^Bearer \S+$/i.test(authorization))
    return new Response(null, { status: 401 });
  if (
    !authorization &&
    req.method === "POST" &&
    req.headers.get("origin") !== authConfig().origin
  )
    return new Response(null, { status: 403 });
  return fetchRequestHandler({
    req,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: authorization
      ? () => verifiedContext(authorization.slice(7))
      : cookieContext,
  });
}
export { handler as GET, handler as POST };
