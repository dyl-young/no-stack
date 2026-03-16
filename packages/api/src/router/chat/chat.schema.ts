import { z } from "zod";

const UIMessagePartSchema = z.looseObject({
  type: z.string(),
});

const UIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(UIMessagePartSchema),
  createdAt: z.string().optional(),
});

export const createChatSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
});

export const getChatSchema = z.object({
  id: z.string(),
});

export const getChatsSchema = z
  .object({
    limit: z.number().min(1).max(100).default(50),
  })
  .optional();

export const deleteChatSchema = z.object({
  id: z.string(),
});

export const saveMessagesSchema = z.object({
  chatId: z.string(),
  messages: z.array(UIMessageSchema),
});

export const deleteMessagesSchema = z.object({
  chatId: z.string(),
  messageIds: z.array(z.string()),
});

export const streamChatSchema = z.object({
  chatId: z.string(),
  messages: z.array(UIMessageSchema),
});
