import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  googleSubject: text("google_subject").notNull().unique(),
  name: text().notNull(),
  email: text(),
  avatarUrl: text("avatar_url"),
});

export const sessions = pgTable(
  "sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("sessions_account_idx").on(table.accountId),
    index("sessions_expiry_idx").on(table.expiresAt),
  ],
);
