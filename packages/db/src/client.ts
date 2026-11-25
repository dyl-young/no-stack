import { createEnv } from "@t3-oss/env-core";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { z } from "zod";

import * as schema from "./schema";

export const env = createEnv({
  server: { POSTGRES_URL: z.url(), POSTGRES_SSL_CA: z.string().optional() },
  // eslint-disable-next-line no-restricted-properties -- Validate the environment at this boundary.
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
const ca = env.POSTGRES_SSL_CA;
const pool = new pg.Pool({
  max: 5,
  connectionString: env.POSTGRES_URL,
  ...(ca
    ? {
        ssl: {
          ca: Buffer.from(ca, "base64").toString("utf8"),
          rejectUnauthorized: true,
        },
      }
    : {}),
});
export const db = drizzle(pool, { schema, casing: "snake_case" });
