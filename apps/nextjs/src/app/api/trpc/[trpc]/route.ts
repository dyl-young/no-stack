import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@no-stack/api";

import { createContext } from "~/trpc/server";

function handler(req: Request) {
  const authorization = req.headers.get("authorization");
  if (authorization && !/^Bearer \S+$/i.test(authorization))
    return new Response(null, { status: 401 });
  return fetchRequestHandler({
    req,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createContext(authorization?.slice(7)),
  });
}
export { handler as GET, handler as POST };
