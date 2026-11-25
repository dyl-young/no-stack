# Local setup

Use Node 24.16.0, pnpm 10.20.0 and Docker Compose. Run from the repository root.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
docker compose up -d --wait
pnpm db:migrate
pnpm auth:local
# In a second terminal
pnpm --filter @no-stack/nextjs dev
```

Open http://localhost:3000. Choose Alice or Bob to exercise profile, sign-out, switching and permanent deletion. The development signer on port 9099 issues short-lived signed test identities. The API uses the same ID-token verifier, PostgreSQL transaction and session checks as live login. Local mode requires a loopback APP_ORIGIN, the local-demo audience and a development server. The standalone production image accepts only Google sign-in.

Setup creates missing environment files and preserves existing overrides. To name a generated project run `pnpm setup:local --name "My App" --slug my-app --app-id dev.example.myapp`. When upgrading a local checkout, reconcile .env and apps/expo/.env with their examples. Use a fresh PostgreSQL database for this greenfield schema. Compose keeps development data in a named volume across restarts. An existing PostgreSQL instance also works via POSTGRES_URL.

### Native

Run `pnpm expo:ios` or `pnpm expo:android` with platform tooling installed, then `pnpm expo:dev` on subsequent runs. iOS Simulator can use the default Expo URLs. For Android Emulator change the host in both Expo URLs to 10.0.2.2. For a physical phone use your computer's LAN address for both Expo URLs, run `LOCAL_SIGNER_HOST=0.0.0.0 pnpm auth:local` and bind Next with `pnpm --filter @no-stack/nextjs dev --hostname 0.0.0.0`. Use a trusted development network and a local database. Anyone with access to the fixture can select either identity.

### Verification

```sh
pnpm audit
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm test:auth
pnpm turbo build --filter=@no-stack/nextjs
pnpm --filter @no-stack/expo exec expo export --platform ios --platform android
docker build --platform linux/amd64 -t no-stack:local .
```

Stop the interactive signer and Next dev server before running test:auth. It starts a disposable PostgreSQL 16 container on a free port, applies the committed migration, starts the signer and Next, then exercises both session transports. Tests cover rejected ID tokens, expiry, account isolation, cookie CSRF protection, server-side sign-out and cascading deletion.

For product tables, edit packages/db/src/schema, run `pnpm db:generate`, review the migration and apply it with `pnpm db:migrate`.
