import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lte, sql } from "drizzle-orm";

import { db } from "./client";
import { accounts, sessions } from "./schema";

const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function issueSession(
  profile: Omit<typeof accounts.$inferInsert, "id">,
  expiresAt: Date,
  previous?: string,
) {
  const token = randomBytes(32).toString("base64url");
  await db.transaction(async (tx) => {
    const { name, email, avatarUrl } = profile;
    const [account] = await tx
      .insert(accounts)
      .values(profile)
      .onConflictDoUpdate({
        target: accounts.googleSubject,
        set: { name, email, avatarUrl },
      })
      .returning({ id: accounts.id });
    if (!account) throw new Error("Account creation failed");
    await tx.delete(sessions).where(lte(sessions.expiresAt, sql`now()`));
    if (previous)
      await tx.delete(sessions).where(eq(sessions.tokenHash, digest(previous)));
    await tx
      .insert(sessions)
      .values({ tokenHash: digest(token), accountId: account.id, expiresAt });
  });
  return token;
}

export async function sessionAccount(token: string) {
  const [account] = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      email: accounts.email,
      avatarUrl: accounts.avatarUrl,
    })
    .from(sessions)
    .innerJoin(accounts, eq(accounts.id, sessions.accountId))
    .where(
      and(
        eq(sessions.tokenHash, digest(token)),
        gt(sessions.expiresAt, sql`now()`),
      ),
    );
  return account ?? null;
}

export async function revokeSession(token: string) {
  await db.delete(sessions).where(eq(sessions.tokenHash, digest(token)));
}

export async function deleteAccount(id: string) {
  await db.delete(accounts).where(eq(accounts.id, id));
}
