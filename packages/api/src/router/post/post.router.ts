import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@no-stack/db";
import { Post } from "@no-stack/db/schema";
import { CreatePostSchema } from "@no-stack/validators";

import { protectedProcedure, publicProcedure } from "../../trpc";
import { DeleteSchema, getByIdSchema } from "./post.schema";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Post.findMany({
      with: { author: true },
      orderBy: desc(Post.id),
      limit: 50,
    });
  }),

  byId: publicProcedure.input(getByIdSchema).query(({ ctx, input }) => {
    return ctx.db.query.Post.findFirst({
      with: { author: true },
      where: eq(Post.id, input.id),
    });
  }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, content } = input;
      const userId = ctx.user.id;

      return ctx.db.insert(Post).values({
        authorId: userId,
        title,
        content,
      });
    }),

  delete: protectedProcedure
    .input(DeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.query.Post.findFirst({
        where: eq(Post.id, input),
      });

      if (data?.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the author is allowed to delete the post",
        });
      }

      return ctx.db.delete(Post).where(eq(Post.id, input));
    }),
} satisfies TRPCRouterRecord;
