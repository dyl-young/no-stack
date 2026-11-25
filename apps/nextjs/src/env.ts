/* eslint-disable no-restricted-properties -- Read server configuration at request time. */
import { z } from "zod";

export function isEmailAllowed(email: string | null) {
  const list = process.env.GOOGLE_ALLOWED_EMAILS;
  if (!list) return true;
  if (!email) return false;
  const normalized = email.toLowerCase();
  return list
    .split(",")
    .some((entry) => entry.trim().toLowerCase() === normalized);
}

export function authConfig() {
  const origin = z.url().parse(process.env.APP_ORIGIN);
  const clientId = z.string().min(1).parse(process.env.GOOGLE_WEB_CLIENT_ID);
  const local = process.env.LOCAL_GOOGLE_AUTH === "1";
  if (origin !== new URL(origin).origin)
    throw new Error("Set APP_ORIGIN to the canonical origin");
  if (
    local &&
    (process.env.NODE_ENV === "production" ||
      process.env.K_SERVICE ||
      clientId !== "local-demo" ||
      !["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
  )
    throw new Error(
      "Local identities require development mode, localhost and the demo client",
    );
  if (!local && !origin.startsWith("https:"))
    throw new Error("Google sign-in requires an HTTPS origin");
  return { origin, clientId, local };
}
