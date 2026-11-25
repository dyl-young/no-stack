#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${PROJECT_ID:?Select a billing-enabled Google Cloud project}"
: "${REGION:?Select a Cloud Run region}"
: "${GOOGLE_WEB_CLIENT_ID:?Set the Google OAuth web client ID}"
: "${RUNTIME_SERVICE_ACCOUNT:?Set the dedicated runtime service account email}"
: "${POSTGRES_URL_SECRET:?Set the Secret Manager secret name and version for POSTGRES_URL}"
sql_args=(--quiet)
if [[ -n "${CLOUD_SQL_INSTANCE:-}" ]]; then sql_args+=(--set-cloudsql-instances="$CLOUD_SQL_INSTANCE"); fi
service=${SERVICE_NAME:-no-stack}
number=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
origin=${APP_ORIGIN:-https://${service}-${number}.${REGION}.run.app}
gcloud run deploy "$service" --source=. --project="$PROJECT_ID" --region="$REGION" \
  --service-account="$RUNTIME_SERVICE_ACCOUNT" --allow-unauthenticated \
  --cpu=1 --memory=512Mi --min-instances=0 --max-instances=3 --concurrency=40 \
  --set-env-vars="^|^GOOGLE_WEB_CLIENT_ID=$GOOGLE_WEB_CLIENT_ID|APP_ORIGIN=$origin|GOOGLE_ALLOWED_EMAILS=${GOOGLE_ALLOWED_EMAILS:-}" \
  --set-secrets="POSTGRES_URL=$POSTGRES_URL_SECRET" \
  "${sql_args[@]}"
