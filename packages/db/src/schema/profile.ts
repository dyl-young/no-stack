import { relations } from "drizzle-orm";
import { uuid, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../lib";
import { createTable } from "./_table";
import { Chat } from "./ai-chat/chat";
import { Users } from "./auth";
import { Post } from "./post";

export const Profile = createTable("profile", {
  // Matches id from auth.users table in Supabase
  id: uuid()
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),
  name: varchar({ length: 256 }).notNull(),
  image: varchar({ length: 256 }),
  email: varchar({ length: 256 }),
  ...timestamps(),
});

export const ProfileRelations = relations(Profile, ({ many }) => ({
  posts: many(Post),
  chats: many(Chat)
}));
