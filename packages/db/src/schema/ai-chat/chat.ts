import { relations } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";

import { Profile } from "../profile";
import { Message } from "./message";
import { AIChatSchema } from "./schema";
import { timestamps } from "../../lib";

export const Chat = AIChatSchema.table("chat", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  title: text(),
  profileId: uuid()
    .references(() => Profile.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps(),
});

export const ChatRelations = relations(Chat, ({ one, many }) => ({
  user: one(Profile, {
    fields: [Chat.profileId],
    references: [Profile.id],
  }),
  messages: many(Message),
}));
