import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

export interface Account {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface AccountContext {
  account: Account | null;
  deleteIdentity: (id: string) => Promise<void>;
}

const t = initTRPC.context<AccountContext>().create({ transformer: superjson });
export const createTRPCRouter = t.router;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.account) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, account: ctx.account } });
});
