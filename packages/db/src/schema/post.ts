import { relations } from "drizzle-orm";
import { text, uuid, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../lib";
import { createTable } from "./_table";
import { Profile } from "./profile";

export const Post = createTable("post", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 256 }).notNull(),
  content: text().notNull(),
  authorId: uuid()
    .notNull()
    .references(() => Profile.id, { onDelete: "cascade" }),
  ...timestamps(),
});

export const PostRelations = relations(Post, ({ one }) => ({
  author: one(Profile, { fields: [Post.authorId], references: [Profile.id] }),
}));
