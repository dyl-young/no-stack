# no-stack

A full stack boilerplate for developing native and web applications.

## About

This is an extended version of [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) implementing authentication using [Supabase Auth](https://supabase.com/docs/guides/auth) on both the web and mobile applications.

### Side note for mobile

**iOS:** One of the requirements for Apple's review process requires you to implement native `Sign in with Apple` if you're providing any other third party authentication method. Read more in [Section 4.8 - Design: Sign in with Apple](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple).

We have preconfigured this for you which you can find [here](./apps/expo/src/utils/auth.ts). All you need to do is to enable the Apple Provider in your [Supabase dashboard](https://app.supabase.com) and fill in your information.

> We currently only supports `Sign in with Apple` - support for more providers on mobile are being worked on!

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```diff
# Install dependencies
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
# Ensure that the POSTGRES_URL is in the same format as in the example
cp .env.example .env

# Push the Drizzle schema to your database (w/ drizzle-kit push)
pnpm db:push

# Or use migrations (w/ drizzle-kit generate and drizzle-kit migrate)
pnpm db:generate
pnpm db:migrate
```

> **NOTE:** Migrations seem preferable for Supabase. Still figuring out the best way to do migrations for local development/branching. <https://twitter.com/plushdohn/status/1780126181490135371>

### Setting up Supabase

1. Go to [the Supabase dashboard](https://app.supabase.com/projects) and create a new project.
2. Under project settings, retrieve the environment variables `reference id`, `project url` & `anon public key` and paste them into [.env](./.env.example) and [apps/expo/.env](./apps/expo/.env.example) in the necessary places. You'll also need the database password you set when creating the project.
3. Under `Auth`, configure any auth provider(s) of your choice. This repo is using Github for Web and Apple for Mobile.
4. If you want to use the `Email` provider and `email confirmation`, go to `Auth` -> `Email Templates` and change the `Confirm signup` from `{{ .ConfirmationURL }}` to `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=signup`, according to <https://supabase.com/docs/guides/auth/redirect-urls#email-templates-when-using-redirectto>. `.RedirectTo` will need to be added to your `Redirect URLs` in the next step.
5. Under `Auth` -> `URL Configuration`, set the `Site URL` to your production URL and add `http://localhost:3000/**` and `https://*-username.vercel.app/**` to `Redirect URLs` as detailed here <https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls>.
6. Setup a trigger when a new user signs up: <https://supabase.com/docs/guides/auth/managing-user-data#using-triggers>. Can run this in the SQL Editor .

```sql
-- inserts a row into public.profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.t3turbo_profile (id, email, name, image)
  values (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'user_name',
      '[redacted]'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    image = excluded.image;
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- trigger the function when a user signs in/their email is confirmed to get missing values
create trigger on_auth_user_verified
  after update on auth.users
  for each row when (
    old.last_sign_in_at is null
    and new.last_sign_in_at is not null
  ) execute procedure public.handle_new_user();
```

```sql
-- drop a trigger if needed
drop trigger "on_auth_user_verified" on auth.users;
```

7. Remove access to the `public` schema as we are only using the server

By default, Supabase exposes the `public` schema to the PostgREST API to allow the `supabase-js` client query the database directly from the client. However, since we route all our requests through the Next.js application (through tRPC), we don't want our client to have this access. To disable this, execute the following SQL query in the SQL Editor on your Supabase dashboard:

```sql
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;
```

![disable public access](https://user-images.githubusercontent.com/51714798/231810706-88b1db82-0cfd-485f-9043-ef12a53dc62f.png)

> Note: This means you also don't need to enable row-level security (RLS) on your database if you don't want to.

### Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator/).
   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

```diff
+  "dev": "expo start --ios",
```

3. Run `pnpm dev` at the project root folder.

> **TIP:** It might be easier to run each app in separate terminal windows so you get the logs from each app separately. This is also required if you want your terminals to be interactive, e.g. to access the Expo QR code. You can run `pnpm --filter expo dev` and `pnpm --filter nextjs dev` to run each app in a separate terminal window.

[This comment](https://github.com/expo/expo/issues/24523#issuecomment-1805791738) might help if you're getting issues with "No Development build"

#### For Android

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator/).
2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

```diff
+  "dev": "expo start --android",
```

3. Run `pnpm dev` at the project root folder.

## References

- For more useful information on how to deploy this stack, refer to [t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
- [Supabase Documentation](https://supabase.com/docs)
- This stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).
- A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.

## Husky Hooks

This project uses Husky to set up Git hooks for ensuring code quality and consistency. The following hooks are configured:

### commit-msg

The `commit-msg` hook is triggered when a commit message is created. It uses Commitlint to check if the commit message follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). The configuration for Commitlint can be found in `commitlint.config.js`.

A convinient way to get the commit message right is to use [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-cli/README.md), or the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits).

### pre-commit

The `pre-commit` hook is triggered before a commit is created. It runs the `lint-staged` script defined in `package.json`. Lint-staged allows you to run linters and formatters on staged files before committing them. The configuration for lint-staged can be found in `package.json`:

- **File:** `package.json`

### pre-push

The `pre-push` hook is triggered before a push is executed. It runs a series of scripts to ensure the codebase is in a good state before pushing. The scripts include:

- `pnpm format:fix`: Formats the codebase using Prettier.
- `pnpm lint:fix`: Lints the codebase using ESLint and fixes any auto-fixable issues.
- `pnpm typecheck`: Runs TypeScript type checking on the codebase.
- `node scripts/checkTags.js`: Runs a custom script to check if all Git tags are annotated.

These hooks help maintain code quality and catch potential issues before they are committed or pushed to the repository.

# Emails

Resend seems to be the best option for sending emails. It's what the example uses.
Check how emails are working locally - it's really slick

# Supabase local development

# Database migrations

- pnpm db:migrate (optional --custom)
- supabase db reset to restart and apply migrations locally

# Local development

- pnpm dev
- pnpm supabase:clean-db
- pnpm supabase:reset-config

# TODO

- [ ] setup and accounts to provision (Vercel, Supabase, Domain name)
- [ ] need apple google developer accounts
- [ ] send email using resend
- [ ] bring in CICD from EDAI
- [ ] setup local supabase instance and integrate into project and dev workflow
- [ ] ensuring configuration parity between supabase projects (try using Terraform)
- [ ]
- [ ] explain how to do database migrations with Drizzle
- [ ] remove public access to public schema

````
7. Remove access to the `public` schema as we are only using the server

By default, Supabase exposes the `public` schema to the PostgREST API to allow the `supabase-js` client query the database directly from the client. However, since we route all our requests through the Next.js application (through tRPC), we don't want our client to have this access. To disable this, execute the following SQL query in the SQL Editor on your Supabase dashboard:

```sql
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;
```

```

````
