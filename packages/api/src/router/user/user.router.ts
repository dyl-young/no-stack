import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@no-stack/db";
import { Profile } from "@no-stack/db/schema";

import { protectedProcedure } from "../../trpc";
import { UpdateProfileSchema } from "./user.schema";

export const userRouter = {
  getUserProfile: protectedProcedure.query(({ ctx }) => {
    const userProfileId = ctx.user.id;

    return ctx.db.query.Profile.findFirst({
      where: eq(Profile.id, userProfileId),
    });
  }),

  updateUserProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(Profile)
        .set(input)
        .where(eq(Profile.id, ctx.user.id));
    }),

  deleteUserProfile: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.supabaseAdminServerClient.auth.admin.deleteUser(
      ctx.user.id,
      true,
    );
  }),
} satisfies TRPCRouterRecord;
