# no-stack

A small TypeScript monorepo for personal web, iOS and Android apps. Next.js hosts the web client and tRPC API. Expo Router handles native navigation. Both clients support Google sign-in, viewing the provider profile, signing out and deleting the app account. Drizzle and PostgreSQL are ready for your first feature. The fresh starter has no product tables.

## First run

Use the Node version in .nvmrc and the pnpm version in package.json. Run `pnpm install --frozen-lockfile` and `pnpm setup:local`. Follow the [local setup guide](docs/setup/LOCAL_SETUP.md) to configure Google, start Supabase and open a device build. Run `pnpm test` to exercise account behavior without cloud credentials.

## Project layout

- apps/nextjs contains web routes, the auth adapter and the API entry point.
- apps/expo contains the native screens and secure session storage.
- packages/api owns the verified account contract and authorization tests.
- packages/db owns the PostgreSQL connection and application schema.
- tooling contains shared TypeScript, ESLint and Prettier configuration.

Use `pnpm lint`, `pnpm typecheck`, `pnpm format` and `pnpm build` to verify a change. The [implementation plan](docs/implementation-plan.md) records the baseline and future experiments.
