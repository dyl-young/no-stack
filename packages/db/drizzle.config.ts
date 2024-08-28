import type { Config } from "drizzle-kit";

import { env } from "./src/client";

const nonPoolingUrl = env.POSTGRES_URL.replace(":6543", ":5432");

export default {
  schema: "./src/schema",
  schemaFilter: ["public", "rag_ai", "auth", "storage"],
  out: "../../supabase/migrations",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
} satisfies Config;
