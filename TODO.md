# TODO

## Must-Have

### Security

- [ ] **Fix CORS config** — `apps/nextjs/src/app/api/trpc/[trpc]/route.ts:15-18` sets `Access-Control-Allow-Origin: *` and `Allow-Headers: *`. Restrict to known domains and specific headers.
- [ ] **Fix open redirect in auth callback** — `apps/nextjs/src/app/auth/callback/route.ts:10` and `auth/confirm/route.ts:11` use `searchParams.get("next")` without validating the URL. An attacker can redirect users to a malicious site. Validate `next` starts with `/` and doesn't contain `//`.
- [ ] **Validate OTP type** — `apps/nextjs/src/app/auth/confirm/route.ts:10` casts `type` as `EmailOtpType` without validating. Should check it's a valid value before passing to `verifyOtp`.
- [ ] **Handle upload errors** — `apps/nextjs/src/utils/supabase/storage.ts:13-15` captures `error` from `supabase.storage.upload()` but never checks or throws it. Upload could silently fail.
- [ ] **Add file upload validation** — `storage.ts` has no file size limit, file type validation (beyond `accept="image/*"` on the input), or sanitisation. Validate server-side.

### Error Handling & UX

- [ ] **Add global error boundary** — No `error.tsx` files exist anywhere in the app. Add at least a root-level `error.tsx` and one for `/dashboard`.
- [ ] **Add loading states** — No `loading.tsx` files exist. Add for route segments with data fetching (dashboard, posts).
- [ ] **Add not-found page** — No `not-found.tsx` at root level. Users hitting invalid routes get the default Next.js 404.
- [ ] **Replace `alert()` with toast** — `apps/nextjs/src/components/composite/user/account-form.tsx:108` uses `alert()` for image upload errors. Should use the existing `toast` from sonner.
- [ ] **Remove debug console.logs** — `apps/nextjs/src/trpc/react.tsx` has ~15 `console.log` statements with emoji prefixes (`🔍`) throughout the tRPC link. Remove or gate behind `NODE_ENV === "development"`.

### Database

- [ ] **Add database indexes** — No indexes on `post.author_id` or `post.created_at` (used for ordering). Add via a new migration:
  ```sql
  CREATE INDEX idx_post_author_id ON post(author_id);
  CREATE INDEX idx_post_created_at ON post(created_at DESC);
  ```
- [ ] **Fix column name mismatch** — `packages/db/src/schema/post.ts:9` maps `title` to column `"name"` in the database. Either rename the column to `title` or document why this is intentional.
- [ ] **Add ON DELETE CASCADE to posts** — `post.author_id` FK has `ON DELETE no action`. If a profile is deleted, orphaned posts will cause FK violations.

### Testing

- [ ] **Set up Vitest** — Zero test files or test config exists. Set up Vitest at the monorepo root with workspace config. Priority test targets:
  - tRPC routers (`packages/api/src/router/`)
  - Validation schemas (`packages/validators/`)
  - Auth flows (`apps/nextjs/src/app/auth/actions.ts`)

### Code Quality

- [ ] **Remove duplicate ResetPasswordSchema** — Defined in both `packages/validators/src/index.ts:28-36` and `apps/nextjs/src/components/composite/auth/reset-password-form.tsx:21-29`. Import from validators package instead.
- [ ] **Fix `as any` casts in tRPC link** — `apps/nextjs/src/trpc/react.tsx:79,113-115` uses multiple `as any` casts for error handling. Create a proper error type guard.

## Nice-to-Have

### Developer Experience

- [ ] **Add Vitest UI** — After setting up Vitest, add `@vitest/ui` for a visual test runner in dev.
- [ ] **Add Playwright/Cypress for E2E** — Auth flows and critical paths would benefit from E2E tests.
- [ ] **Clean up unused env vars** — `.env.example` defines `OPENAI_API_KEY`, `KV_URL`, `KV_REST_API_*` but none are used in the app. Remove or add a comment explaining future use.
- [ ] **Add `updatedAt` column name consistency** — `packages/db/src/schema/post.ts:17` uses camelCase `"updatedAt"` for the column while all other columns use snake_case. Should be `"updated_at"`.

### SEO & Metadata

- [ ] **Add metadata to auth pages** — Auth pages (signin, signup, forgot-password, reset-password) have no `Metadata` export. Add basic titles.
- [ ] **Add sitemap.ts and robots.ts** — Standard Next.js SEO files are missing.

### Error Tracking & Observability

- [ ] **Add error tracking** — No Sentry/Datadog/similar. The tRPC error handler at `route.ts:43-45` only does `console.error`. Consider Sentry for production error visibility.
- [ ] **Add structured logging** — Replace `console.log`/`console.error` with a proper logging library (e.g., pino) that outputs structured JSON in production.

### Auth Hardening

- [ ] **Add rate limiting** — No rate limiting on auth endpoints (signup, password reset, login). Consider Upstash ratelimit or similar.
- [ ] **Add password strength requirements** — Current minimum is 6 characters. Consider requiring mixed case, numbers, or using zxcvbn.

### UI / Accessibility

- [ ] **Audit keyboard navigation** — Forms and dialogs should be fully keyboard-navigable. The delete account flow in `account-form.tsx` could use focus management.
- [ ] **Add skip-to-content link** — Standard accessibility improvement for the root layout.

### Performance

- [ ] **Consider `useSuspenseQuery`** — `apps/nextjs/src/components/composite/posts/posts.tsx:88` has a TODO about making `useSuspenseQuery` work with RSC. Worth revisiting.
- [ ] **Optimise post queries** — `post.router.ts:13-18` `all` query has a hardcoded `limit: 10` with no pagination. Add cursor-based pagination for scalability.

### Infrastructure

- [ ] **Add health check endpoint** — No `/api/health` route for monitoring/load balancer checks.
- [ ] **Add CSP headers** — No Content Security Policy headers configured. Add via `next.config.ts` or middleware.
- [ ] **Review middleware matcher** — `middleware.ts:12` matcher pattern is copied from Clerk docs but this uses Supabase auth. Verify it's appropriate.
