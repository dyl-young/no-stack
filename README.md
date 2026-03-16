<p align="center">
  <img src="apps/nextjs/public/logo-bg-white.png" alt="no-stack" width="360" />
</p>
<h1 align="center">no-stack</h1>

<p align="center">
A full-stack TypeScript monorepo template for building web and mobile applications with: Next.js + Expo + Supabase + tRPC
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/tRPC-2596BE?logo=trpc&logoColor=white" alt="tRPC" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Drizzle-C5F74F?logo=drizzle&logoColor=black" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
</p>

---

> Based on [create-t3-turbo](https://github.com/supabase-community/create-t3-turbo) by the Supabase community.

<p align="center">
<img src="docs/assets/image.png" alt="app screenshot" />
</p>

## Overview

A production-ready monorepo with shared code across web (Next.js) and mobile (Expo/React Native), backed by a type-safe API layer and PostgreSQL database.

### Apps

| App           | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `apps/nextjs` | Next.js 16 web app with React 19, Radix UI components, and Tailwind CSS |
| `apps/expo`   | Expo 54 mobile app with React Native, RN Primitives, and NativeWind     |

### Shared Packages

| Package               | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| `packages/api`        | tRPC server — type-safe API routes shared across web and mobile           |
| `packages/db`         | Drizzle ORM schema, migrations, and database client (Supabase/PostgreSQL) |
| `packages/files`      | File management utilities                                                 |
| `packages/validators` | Zod validation schemas shared across all apps                             |

### Tooling

| Package              | Description                           |
| -------------------- | ------------------------------------- |
| `tooling/eslint`     | Shared ESLint configuration           |
| `tooling/prettier`   | Shared Prettier configuration         |
| `tooling/tailwind`   | Shared Tailwind config (web + native) |
| `tooling/typescript` | Shared TypeScript configurations      |

## Key Libraries

- **UI (Web):** Radix UI primitives + shadcn pattern, Tailwind CSS, Framer Motion
- **UI (Mobile):** RN Primitives (Radix-compatible), NativeWind (Tailwind for RN), Reanimated
- **API:** tRPC 11 + TanStack React Query for end-to-end type safety
- **Database:** Drizzle ORM + Supabase (PostgreSQL)
- **Validation:** Zod across all layers
- **Forms:** React Hook Form + Zod resolvers
- **Auth:** Supabase Auth
- **Build:** Turborepo for task orchestration, pnpm workspaces

## Getting Started

1. Set up your local environment by following [LOCAL_SETUP.md](docs/setup/LOCAL_SETUP.md)
2. Run the applications by following [RUNNING_LOCALLY.md](docs/development/RUNNING_LOCALLY.md)

## Deployment & CI/CD

See [DEPLOYMENT.md](docs/setup/DEPLOYMENT.md) for GitHub Actions workflows, environment setup, and new project configuration.
