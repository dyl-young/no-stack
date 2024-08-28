# Local setup

[Take me 🔙](../../README.md)

This guide will walk you through setting up no-stack on your local machine

As always, begin with:
`pnpm i`

## Supabase setup

This project emulates the entire Supabase environment locally. You will need to download docker to run this:

1. Install docker on your local machine if you don't already have it:

- [Colima](https://github.com/abiosoft/colima) is a simple, lightweight macOS native alternative to Docker Desktop
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) is the full featured version (but heavy on resources)

2. If you're running Windows, you need to disable supabase analytics in `./supabase/config.toml`:

```toml
[analytics]
enabled = false
```

3. Start the Supabase server:

```bash
pnpm dev -F supabase
```

After the docker files install, you should see the following:

```
supabase local development setup is running.
API URL: http://localhost:54321
GraphQL URL: http://localhost:54321/graphql/v1
S3 Storage URL: http://localhost:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
```

If this doesn't work, try run `npx supabase start` from the root directory of the project.

Note: if you are already running a supabase instance, you will need to run `pnpm supabase:update-config` and this should restart the supabase instances with the new config.

## Expo setup

Next you will setup a local simulator for your device.

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator/).
2. After installing XCode you will need to manually open the simulator, just once.
3. Run `npx expo start` then enter `I` to launch Expo Go

You should see the Expo Go app on a local simulated device.

## .env setup

Next setup your local environment variables for development. Please note that due to the fact that Supabase emulates the local environment, the environment variables will always be the same. Therefore you can simply create the .env files from the .env.example files.
Note that you should never commit the .env files in your repository as this is going to cause some big issues in the CICD pipelines that build the live environments.

To setup your .env files:

```bash
cp apps/expo/.env.example apps/expo/.env
```

And you should be good to go 🎉

## What's Next?

Now take a look at [RUNNING_LOCALLY.md](../development/RUNNING_LOCALLY.md) to see how to run the applications.

<!-- Now can you create a script to do this all for them? -->
