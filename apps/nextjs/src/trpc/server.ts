import { cache } from "react";
import { cookies } from "next/headers";

import { appRouter } from "@no-stack/api";

import { sessionCookie, verifiedContext } from "~/utils/session";

export const cookieContext = cache(async () =>
  verifiedContext((await cookies()).get(sessionCookie().name)?.value),
);

export const getCaller = cache(async () =>
  appRouter.createCaller(await cookieContext()),
);
