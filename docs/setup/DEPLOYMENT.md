# Deployment

Build the web/API service with the pinned Node and pnpm versions using `pnpm --filter @no-stack/nextjs build`. Supply the public Supabase URL and anon key at build time and provide the server service-role key at runtime. Start the service with `pnpm --filter @no-stack/nextjs start`. Its health endpoint is /api/health. A standard Node host can run the service. Database features use POSTGRES_URL through node-postgres.

Configure Google in the target Supabase project's authentication settings, disable email and phone signup, and allowlist the exact web and native callback URLs. Enable account creation through the Google provider. Keep the service-role credential out of client settings. Use a separate project for each deployed environment.

Set EXPO_PUBLIC_BASE_URL to the deployed web/API origin and set the two public Supabase values for the native build. Register the platform IDs from starter.json. Build a development client before testing the real Google callback on iOS or Android.

Deploy the fresh base to a new database. Run migrations from one deployment job as you add tables. Projects on older starter revisions must retain their existing SQL migration history and plan an explicit cutover.

The manual Deploy workflow applies database migrations to the selected GitHub environment. Configure SUPABASE_PROJECT_REF, SUPABASE_ACCESS_TOKEN and SUPABASE_DB_PASSWORD for that environment. The manual EAS workflow builds binaries for the selected profile.
