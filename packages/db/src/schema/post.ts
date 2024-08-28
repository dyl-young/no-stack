import { relations, sql } from "drizzle-orm";
import { text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const Post = createTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => Profile.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const PostRelations = relations(Post, ({ one }) => ({
  author: one(Profile, { fields: [Post.authorId], references: [Profile.id] }),
}));
