import type { TRPCRouterRecord } from "@trpc/server";
import type { UIMessage } from "ai";
import { TRPCError } from "@trpc/server";

import { desc, eq, inArray } from "@no-stack/db";
import { Chat, Message } from "@no-stack/db/schema";

import { protectedProcedure } from "../../trpc";
import {
  createChat,
  createStreamingChat,
  generateChatTitle,
  getChat,
  saveChatMessages,
} from "./chat.helpers";
import {
  createChatSchema,
  deleteChatSchema,
  deleteMessagesSchema,
  getChatSchema,
  getChatsSchema,
  saveMessagesSchema,
  streamChatSchema,
} from "./chat.schema";

export const chatRouter = {
  createChat: protectedProcedure
    .input(createChatSchema)
    .mutation(async ({ ctx, input }) => {
      return createChat({
        id: input.id,
        profileId: ctx.user.id,
        title: input.title ?? "New Chat",
      });
    }),

  getChats: protectedProcedure
    .input(getChatsSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.Chat.findMany({
        where: eq(Chat.profileId, ctx.user.id),
        orderBy: desc(Chat.createdAt),
        limit: input?.limit ?? 50,
      });
    }),

  getChat: protectedProcedure
    .input(getChatSchema)
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.query.Chat.findFirst({
        where: eq(Chat.id, input.id),
        with: { messages: true },
      });

      if (chat?.profileId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      return chat;
    }),

  deleteChat: protectedProcedure
    .input(deleteChatSchema)
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.query.Chat.findFirst({
        where: eq(Chat.id, input.id),
        columns: { profileId: true },
      });

      if (chat?.profileId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorised to delete this chat",
        });
      }

      return ctx.db.delete(Chat).where(eq(Chat.id, input.id));
    }),

  saveMessages: protectedProcedure
    .input(saveMessagesSchema)
    .mutation(async ({ input }) => {
      await saveChatMessages({
        chatId: input.chatId,
        messages: input.messages as unknown as UIMessage[],
      });
    }),

  deleteMessages: protectedProcedure
    .input(deleteMessagesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(Message).where(inArray(Message.id, input.messageIds));
    }),

  streamChat: protectedProcedure
    .input(streamChatSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const lastUserMessage = input.messages.find((msg) => msg.role === "user");

      if (!lastUserMessage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No user message found",
        });
      }

      // Create chat if it doesn't exist
      const existingChat = await getChat({ id: input.chatId });

      if (!existingChat) {
        const textPart = lastUserMessage.parts.find(
          (p): p is { type: "text"; text: string } => p.type === "text",
        );
        const title = await generateChatTitle({
          message: textPart?.text ?? "New Chat",
        });
        await createChat({ id: input.chatId, profileId: userId, title });
      }

      return createStreamingChat({
        messages: input.messages as unknown as UIMessage[],
      });
    }),
} satisfies TRPCRouterRecord;
