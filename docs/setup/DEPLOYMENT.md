# Deployment & CI/CD

[Take me 🔙](../../README.md)

This project uses **GitHub Actions** for CI/CD, **Vercel** for hosting the Next.js app, and **Supabase** for the backend. Native app builds are handled by **Expo Application Services (EAS)**.

## Workflow overview

There are three workflow files in `.github/workflows/`:

### 1. `ci.yml` — Quality gates + build

**Triggers:** push to `main`, pull requests to `main`

Runs the following jobs **in parallel**:

| Job            | Command                         | Notes                                       |
| -------------- | ------------------------------- | ------------------------------------------- |
| Typecheck      | `pnpm typecheck`                | Via Turborepo                               |
| Lint           | `pnpm lint`                     | ESLint with caching                         |
| Format         | `pnpm format`                   | Prettier check                              |
| Security Audit | `pnpm audit --audit-level=high` | `continue-on-error: true` — won't block PRs |

Once typecheck, lint, and format pass, a **Build** job runs `pnpm turbo build --filter=@no-stack/nextjs` to verify the app compiles.

A **concurrency group** automatically cancels stale CI runs when new commits are pushed.

### 2. `deploy.yml` — Environment deployments

**Triggers:** push to `main`, tags matching `uat/v*` or `prod/v*`

| Trigger        | Environment  | What happens                                                       |
| -------------- | ------------ | ------------------------------------------------------------------ |
| Push to `main` | `qa`         | Deploys Supabase config (Vercel auto-deploys the app)              |
| Tag `uat/v*`   | `uat`        | Deploys Supabase config + force-pushes to `uat` branch for Vercel  |
| Tag `prod/v*`  | `production` | Deploys Supabase config + force-pushes to `prod` branch for Vercel |

Production deployments are gated by **GitHub environment protection rules** (configured in repo settings, not in the workflow file).

### 3. `eas-build.yml` — Native app builds (manual)

**Trigger:** `workflow_dispatch` (manual) with a `profile` input (`qa`, `uat`, or `production`)

Runs `eas build --platform all --non-interactive --no-wait --profile <selected> --auto-submit` from the `apps/expo` directory.

Trigger this from the **Actions** tab in GitHub.

---

## Setting up a new project

This section walks through everything needed to go from a fresh clone of the boilerplate to three hosted environments (QA, UAT, Production).

### Prerequisites

The following third-party services need to be set up. The founders should create the account, add billing, and invite the tech lead as an admin.

| Service                 | Cost                          | Link                                                                                      | Notes                         |
| ----------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------- |
| Expo                    | On-demand                     | https://expo.dev/signup                                                                   | Pay-on-demand is an option    |
| Vercel                  | $20/month per member          | https://vercel.com/signup                                                                 | Need to invite all developers |
| Supabase                | $25/month                     | https://supabase.com/dashboard/sign-up                                                    | Need to invite all developers |
| Apple Developer Account | $99/year                      | [Become a member - Apple Developer Program](https://developer.apple.com/programs/enroll/) | Need to invite all developers |
| Google Play Account     | $25 one-time fee              | https://play.google.com/console/u/0/signup                                                | Need to invite all developers |
| GoDaddy (or DNS host)   | Depends on domain             | https://www.godaddy.com/                                                                  | Invite tech lead              |
| Resend                  | $19.95/month                  | https://resend.com/                                                                       | Invite tech lead              |

### 1. Supabase

- Create a Supabase organisation named `[project-name]`
- Create three projects within the organisation:
  - `[project-name]-qa`
  - `[project-name]-uat`
  - `[project-name]-prod`
- For each project, collect and temporarily store the following values (you can use `./DO_NOT_COMMIT_temporary_secrets_file.txt` — never commit this):

| Variable                       | Where to find it                                                          |
| ------------------------------ | ------------------------------------------------------------------------- |
| `SUPABASE_PROJECT_REF`         | Project Settings > General: Project ID                                    |
| `SUPABASE_DB_PASSWORD`         | Set at project creation — avoid special characters (`@`, `&`, `!`, `/`)   |
| `POSTGRES_URL`                 | Project Settings > Database > Connect > Transaction pooler (see below)    |
| `SUPABASE_URL`                 | Project Settings > API: Project URL                                       |
| `SUPABASE_ANON_KEY`            | Project Settings > API: Project API Keys > anon public                    |
| `SUPABASE_SERVICE_ROLE_SECRET` | Project Settings > API: Project API Keys > service_role                   |

**`POSTGRES_URL` format:**

```
postgresql://postgres.[SUPABASE_PROJECT_REF]:[SUPABASE_DB_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?workaround=supabase-pooler.vercel
```

Use the transaction pooler connection string and append `?workaround=supabase-pooler.vercel`.

#### Supabase configuration (all three projects)

- **Email template:** Authentication > Email templates > `Confirm signup` — paste the template from `supabase/templates/confirmation.html`
- **Redirect URL:** Authentication > URL Configuration:
  - `Site URL` → `https://[env].[project-name].com`
  - (QA only) Add `https://*.vercel.app` as a Redirect URL for Vercel preview deployments
- **Custom SMTP:** See the [Resend](#5-resend) section below

### 2. Vercel

#### Initial setup

1. Navigate to your Vercel Team account
2. Create a new project and connect the GitHub repo
   - Name: `[project-name]-nextjs`
   - Framework Preset: **Next.js**
   - Root Directory: `apps/nextjs`
3. Click **Deploy** (it's OK if this fails — environment variables come next)

#### Branch configuration

1. Create `uat` and `prod` branches off `main` in the GitHub repo
2. In Vercel, navigate to **Settings > Git > Production Branch** and set it to `prod`

> **Tip:** If you see "Invalid Configuration" with no details, navigate to **Settings > Domains**, click Edit on the production domain, disable **Auto-assign Custom Production Domains**, and manually assign the domain to the `prod` branch.

#### Function region

Navigate to **Settings > Functions > Function Region** and select the region closest to your users.

#### Environment variables

Navigate to **Settings > Environment Variables** and add the following for each environment:

| Variable                        | QA                                  | UAT                     | Production              |
| ------------------------------- | ----------------------------------- | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Preview (all preview branches)      | Preview (`uat` branch)  | Production              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Preview (all preview branches)      | Preview (`uat` branch)  | Production              |
| `SUPABASE_SERVICE_ROLE_SECRET`  | Preview (all preview branches)      | Preview (`uat` branch)  | Production              |
| `POSTGRES_URL`                  | Preview (all preview branches)      | Preview (`uat` branch)  | Production              |

> **Note:** For QA, set against the Preview environment with **All Preview Branches** enabled (not a specific branch). This ensures PR preview deployments also point at the QA environment.

#### Domains

Navigate to **Settings > Domains** and add:

| Domain                        | Branch |
| ----------------------------- | ------ |
| `qa.[project-name].com`      | `main` |
| `uat.[project-name].com`     | `uat`  |
| `app.[project-name].com`     | `prod` |

For non-Vercel team members to access QA and UAT, disable **Vercel Authentication** in **Settings > Deployment Protection**.

#### DNS records

In your DNS provider, add CNAME records for each subdomain:

| Subdomain | Type  | Value                 |
| --------- | ----- | --------------------- |
| `qa`      | CNAME | `cname.vercel-dns.com.` |
| `uat`     | CNAME | `cname.vercel-dns.com.` |
| `app`     | CNAME | `cname.vercel-dns.com.` |

#### Admin dashboard

The admin dashboard is part of the Next.js app at `/dashboard/admin`. To grant admin access on a hosted environment:

1. Create a user through the regular signup flow
2. In the Supabase dashboard, go to **Table Editor > `profile`**
3. Set `is_admin` to `true` for that user

### 3. GitHub Actions

#### Repository secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret                          | Used by   | Description                                  |
| ------------------------------- | --------- | -------------------------------------------- |
| `POSTGRES_URL`                  | CI build  | Database connection string (QA environment)   |
| `NEXT_PUBLIC_SUPABASE_URL`      | CI build  | Supabase project URL (QA environment)         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | CI build  | Supabase anonymous key (QA environment)       |
| `EXPO_TOKEN`                    | EAS build | Expo access token for EAS CLI authentication |

**Optional (for Turborepo remote caching):**

| Secret / Variable       | Used by | Description                            |
| ----------------------- | ------- | -------------------------------------- |
| `TURBO_TOKEN` (secret)  | CI      | Turborepo remote cache token           |
| `TURBO_TEAM` (variable) | CI      | Turborepo team name for remote caching |

#### Environment secrets

Create three **environments** in **Settings → Environments**: `qa`, `uat`, `production`.

For each environment, add:

| Secret                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `SUPABASE_PROJECT_REF` | Supabase project reference ID for this environment |
| `SUPABASE_DB_PASSWORD` | Supabase database password for this environment    |

#### Environment protection rules

For the `production` environment, enable **Required reviewers** to gate production deployments behind manual approval.

### 4. Node version

The Node version is pinned in `.nvmrc` (currently `20.12`). All CI workflows read from this file — update it there to change the version everywhere.

### 5. Resend

1. Navigate to [Resend > Domains](https://resend.com/domains) and add the project's root domain (`[project-name].com`)
2. Add the provided DKIM, SPF, and DMARC records to your DNS provider
3. Generate an API key at [Resend > API Keys](https://resend.com/api-keys)
4. For each Supabase project, go to **Project Settings > Authentication > SMTP Settings**:
   - Enable **Custom SMTP**
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: the Resend API key

### 6. Expo / EAS

- Configure build profiles in `eas.json`
- Add the following environment variables for each profile:
  - `EXPO_PUBLIC_BASE_URL` — the domain for each environment
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Add Apple IDs to the `"submit"` section of `eas.json`:
  - `ascAppId` — found at [App Store Connect](https://appstoreconnect.apple.com/apps) > Your App > General > App Information
  - `appleTeamId` — found at [Apple Developer Account](https://developer.apple.com/account) > Membership details

### 7. Apple App Store

1. Create an [Apple Developer Account](https://developer.apple.com/programs/enroll/) and add developers to the organisation
2. Register a bundle identifier at [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
   - Use the domain name as the **Bundle ID** and **SKU** (e.g. `com.example.app`)
3. Create a new app in [App Store Connect](https://appstoreconnect.apple.com/apps) with **Full Access**

#### TestFlight setup

1. Navigate to App Store Connect > Your App > TestFlight
2. Under **Internal Testing**, create groups:
   - `QA Testers`
   - `UAT Testers`
3. **Important:** Un-select **Enable automatic distribution** for each group
4. Add the relevant test users to each group

#### TestFlight releases

> Build/version numbers must be incremented for each build — you cannot submit with the same app version or build number.

1. Create a release branch off `main`
2. Update `buildVersion` and `releaseVersion` in `app.config.ts`
3. Merge to `main`
4. Trigger a build from **Actions → EAS Build** in GitHub (select the appropriate profile)
5. Once built, retrieve the iOS **Build ID** from the Expo project dashboard (Builds > All Builds > Show details)
6. Submit to TestFlight:

```bash
cd apps/expo
eas submit --platform ios --profile qa --id <ios-build-id>
```

7. In App Store Connect, add the submitted build to the relevant test group

### 8. Google Play Store

1. Create a [Google Play Developer Account](https://play.google.com/console/u/0/signup) and add developers
2. Follow the [Expo first Android submission guide](https://github.com/expo/fyi/blob/main/first-android-submission.md)

### 9. Rename the project

If you've renamed the project from `no-stack`, ensure the build filter in `ci.yml` matches the new Next.js package name:

```yaml
# In .github/workflows/ci.yml, update the build step:
- run: pnpm turbo build --filter=@your-project/nextjs
```

---

## Deployment flow

```
Developer pushes to main
  → CI runs quality gates (typecheck, lint, format, audit)
  → If gates pass, build is verified
  → Vercel auto-deploys to QA
  → Supabase config deployed to QA environment

Developer creates tag uat/v1.0.0
  → Supabase config deployed to UAT environment
  → Code force-pushed to uat branch → Vercel deploys to UAT

Developer creates tag prod/v1.0.0
  → Requires manual approval (environment protection rule)
  → Supabase config deployed to Production environment
  → Code force-pushed to prod branch → Vercel deploys to Production
```

## Triggering native builds

1. Go to **Actions → EAS Build** in GitHub
2. Click **Run workflow**
3. Select the build profile (`qa`, `uat`, or `production`)
4. The build runs on EAS servers and auto-submits to app stores
