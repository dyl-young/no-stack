import { defineConfig } from "drizzle-kit";

import { env } from "./src/client";

export default defineConfig({
  schema: "./src/schema/index.ts",
  schemaFilter: ["public"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.POSTGRES_URL },
  casing: "snake_case",
});
