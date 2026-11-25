# Deploy one web and API service

Choose a billing-enabled Google Cloud project and a region near your users. The example assumes low intermittent traffic, one vCPU, 512 MiB RAM, concurrency 40 and zero to three Cloud Run instances. Budget separately for PostgreSQL, builds, retained images, logs and egress. A running Cloud SQL instance has an idle cost even when Cloud Run scales to zero. [Cloud Run pricing](https://cloud.google.com/run/pricing) · [Cloud SQL pricing](https://cloud.google.com/sql/pricing)

### Google sign-in clients

1. Configure the Google Auth Platform branding, audience and test users. Create a **Web application** OAuth client. Add the exact canonical HTTPS origin to its authorized JavaScript origins. The default Cloud Run origin is `https://SERVICE_NAME-PROJECT_NUMBER.REGION.run.app`. Web uses the Google Identity Services popup callback. Set GOOGLE_WEB_CLIENT_ID to this client ID. [Google web setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
2. Create iOS and Android OAuth clients in the same project using the bundle ID and package from starter.json. Register each Android build's signing certificate SHA-1. The native SDK requests an ID token for the web client ID, which the API verifies on both platforms. [Native Google setup](https://react-native-google-signin.github.io/docs/setting-up/expo)
3. For live Expo builds set EXPO_PUBLIC_BASE_URL to the canonical HTTPS origin, EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to the web client ID and EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID to the iOS client ID. Remove EXPO_PUBLIC_LOCAL_GOOGLE_URL. Rebuild after changing IDs so the iOS plugin registers the reversed client ID scheme.

To limit access, set `GOOGLE_ALLOWED_EMAILS` in the deployment environment (for example, `you@gmail.com,friend@gmail.com`). An unset or empty value allows any valid Google sign-in. Web and mobile use the same server setting. After you remove an address and deploy the updated setting, its existing sessions lose access too.

### Database and service identity

Provision PostgreSQL accessible from Cloud Run. Store its connection URL in Secret Manager. Grant the dedicated runtime service account Secret Manager Secret Accessor on that secret. For a remote TCP database configure verified TLS in the connection URL. Each instance uses a pool of up to five connections. Size the database for scaling and overlapping revisions.

For Cloud SQL, colocate the instance with the service, enable the Cloud SQL Admin API, grant the runtime identity Cloud SQL Client, and set CLOUD_SQL_INSTANCE to `project:region:instance`. A socket URL in Secret Manager can take the form `postgresql://USER:PASSWORD@localhost/DATABASE?host=/cloudsql/PROJECT:REGION:INSTANCE`. Percent-encode credentials. For another PostgreSQL host, omit CLOUD_SQL_INSTANCE and configure networking to reach it. [Cloud Run PostgreSQL connections](https://cloud.google.com/sql/docs/postgres/connect-run)

From a trusted migration environment with database access, export POSTGRES_URL for the target database, install the frozen dependencies, and run `pnpm db:migrate` once before deploying the revision. A Cloud SQL Auth Proxy connection can provide this access from a developer machine. The migration identity needs DDL permission. The runtime database role needs schema usage, reads and writes on accounts and sessions.

### Deploy

Enable Cloud Run, Cloud Build, Artifact Registry and Secret Manager APIs. Provide a dedicated runtime service account. Grant the deployer Cloud Run Source Developer and Service Usage Consumer on the project, Service Account User on the runtime identity and permission to set the service IAM policy for public invocation. Grant Cloud Run Builder to the active build service account. Create or permit creation of the regional cloud-run-source-deploy artifact repository. [Source deployment prerequisites](https://cloud.google.com/run/docs/deploying-source-code)

Export PROJECT_ID, REGION, RUNTIME_SERVICE_ACCOUNT, GOOGLE_WEB_CLIENT_ID and POSTGRES_URL_SECRET (a Secret Manager reference such as `starter-database-url:1`). Optional variables are SERVICE_NAME (defaults to no-stack), APP_ORIGIN (canonical HTTPS origin without trailing slash) and CLOUD_SQL_INSTANCE. Run:

```sh
scripts/deploy-cloud-run.sh
```

The script builds the repository Dockerfile and attaches the service identity and database secret. For GitHub Actions configure the same environment variables as GitHub environment variables, plus DEPLOY_SERVICE_ACCOUNT and WORKLOAD_IDENTITY_PROVIDER for OIDC authentication. Restrict federation to the repository and deployment ref/environment. [Google GitHub authentication](https://github.com/google-github-actions/auth)

After deployment verify /api/health, then sign in with disposable real Google users on web and both native development builds. Exercise cancellation, relaunch, switching and deletion. Web uses a five-day Secure HTTP-only cookie. Native stores a five-day app session token in SecureStore. The server revokes sessions in PostgreSQL on sign-out and all sessions on account deletion. Deletion affects the app account and its stored profile. [Google ID-token verification](https://developers.google.com/identity/sign-in/ios/backend-auth)
