import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";
import { createEnv } from "@t3-oss/env-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import ws from "ws";
import { z } from "zod";

import * as schema from "./schema";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
    SUPABASE_SSL_CERT: z.string().optional(),
  },
  // eslint-disable-next-line no-restricted-properties
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

// The following code is only used to connect to the local development environment supabase database
// See more in docs/architecture-decision-records/decisions/0001-neondb-for-local-db-connection.md
// eslint-disable-next-line no-restricted-properties
if (!process.env.VERCEL_ENV) {
  neonConfig.webSocketConstructor = ws;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
  neonConfig.wsProxy = (host) => `${host}:54321/pooler/v2/`;
}

// 2. Create the client based on the environment
// eslint-disable-next-line no-restricted-properties
const client = process.env.VERCEL_ENV
  ? new Pool({
      // PRODUCTION (Vercel -> Supabase)
      // We use standard 'pg' (TCP) because Supabase Transaction Poolers (port 6543)
      // do not support the WebSockets that @Vercel/postgres uses.
      connectionString: env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: true,
        ca: env.SUPABASE_SSL_CERT
          ? Buffer.from(env.SUPABASE_SSL_CERT, "base64").toString("utf-8")
          : undefined,
      },
    })
  : new NeonPool({
      // LOCAL DEV (Local -> Supabase via Neon Proxy)
      // We use NeonPool to respect the 'neonConfig' proxy settings above.
      connectionString: env.POSTGRES_URL,
    });

export const db = drizzle(client as Pool, { schema });
