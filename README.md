# no-stack

A Google-only starter for web, iOS and Android. Next.js hosts the web app and shared tRPC API. Both clients exchange a Google ID token for an app session stored in PostgreSQL. Each Google subject maps to an app-owned account ID. Signing out revokes the current session. Deleting an account revokes all its sessions.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
docker compose up -d --wait
pnpm db:migrate
pnpm auth:local
# In another terminal
pnpm --filter @no-stack/nextjs dev
```

Open http://localhost:3000 and choose Alice or Bob. The development signer and database run locally without Google credentials.

- [Local setup and tests](docs/setup/LOCAL_SETUP.md)
- [Google clients and Cloud Run deployment](docs/setup/DEPLOYMENT.md)
- [Architecture](docs/diagrams/C4.md)
