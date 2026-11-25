# Local setup

Install Node 24, the pinned pnpm from package.json, and Docker. Run `pnpm install --frozen-lockfile`, then `pnpm setup:local` to create the root and Expo environment files. Existing files are preserved.

Register a Google OAuth web client and set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the root .env. Register the Supabase OAuth callback (locally http://localhost:54321/auth/v1/callback) with Google. Configure the web callback and native scheme in Supabase's redirect allowlist. Hosted Supabase projects need the same Google-only provider settings applied separately. Keep the service role key on the server.

Use `pnpm dev:without-expo` for the web and API. For a native development build run `pnpm expo:ios` or `pnpm expo:android`. Set EXPO_PUBLIC_BASE_URL and EXPO_PUBLIC_SUPABASE_URL to addresses reachable by that device. On a physical phone use the development machine's LAN address and register the reachable Supabase callback. Use HTTPS or a configured tunnel where Google requires it. For a new project, run `pnpm setup:local --name "Field Notes" --slug field-notes --app-id dev.example.fieldnotes`. This synchronizes project identity and the local OAuth redirect. Point hosted auth at the same callback before deployment.

This is a fresh-project schema. Existing apps must keep their migrations and migrate accounts separately.
