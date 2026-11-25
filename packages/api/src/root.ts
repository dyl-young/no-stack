import { createTRPCRouter, protectedProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  account: createTRPCRouter({
    me: protectedProcedure.query(({ ctx }) => ctx.account),
    remove: protectedProcedure.mutation(async ({ ctx }) => {
      await ctx.deleteIdentity(ctx.account.id);
      return { deleted: true };
    }),
  }),
});
export type AppRouter = typeof appRouter;
