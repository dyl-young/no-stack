import { relations } from "drizzle-orm";
import { json, uuid, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../../lib";
import { Chat } from "./chat";
import { AIChatSchema } from "./schema";

export const Message = AIChatSchema.table("message", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  chatId: uuid()
    .references(() => Chat.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar({ length: 20 }).notNull(),
  parts: json().notNull(),
  attachments: json().notNull().default([]),
  ...timestamps(),
});

export const MessageRelations = relations(Message, ({ one }) => ({
  chat: one(Chat, {
    fields: [Message.chatId],
    references: [Chat.id],
  }),
}));
