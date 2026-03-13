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

### Infrastructure

- [ ] **Add CSP headers** — No Content Security Policy headers configured. Add via `next.config.ts` or middleware.
- [ ] **Review middleware matcher** — `middleware.ts:12` matcher pattern is copied from Clerk docs but this uses Supabase auth. Verify it's appropriate.

### Upstream Alignment (create-t3-turbo)

- [ ] **Upgrade Tailwind CSS v3 → v4** — Upstream is on `^4.1.16` with CSS-first config (`@tailwindcss/postcss`, `@tailwindcss/vite`). Replaces JS config files with `theme.css`. `tw-animate-css` replaces `tailwindcss-animate`. Affects `tooling/tailwind`, both apps, and all component styling.
- [ ] **Upgrade NativeWind v4 → v5** — Upstream is on `5.0.0-preview.2` with new `react-native-css` (`3.0.1`) dependency. Aligns with Tailwind v4's CSS-first approach. Do alongside Tailwind v4 migration.
- [ ] **Upgrade Zod 3 → Zod 4** — Upstream is on `^4.1.12`. Breaking API changes — affects `packages/validators`, `drizzle-zod` (upgrade to `^0.8.3`), and all Zod usage across the monorepo.
- [ ] **Upgrade tRPC to ^11.7 and switch to `@trpc/tanstack-react-query`** — Upstream replaced `@trpc/react-query` with `@trpc/tanstack-react-query`. Also uses `localLink` for direct SSR procedure invocation (no HTTP round-trip during SSR).
- [ ] **Upgrade Drizzle ORM** — From `^0.40.1` / `drizzle-kit ^0.30.5` to `^0.44.7` / `drizzle-kit ^0.31.5`. Likely non-breaking.
- [ ] **Consolidate Radix UI packages** — Upstream uses a single `radix-ui` package (`^1.4.3`) instead of 20+ individual `@radix-ui/react-*` packages. Simplifies `apps/nextjs/package.json`.
- [ ] **Upgrade `@t3-oss/env-nextjs`** — From `^0.11.1` to `^0.13.8`.
- [ ] **Switch `@shopify/flash-list` → `@legendapp/list`** — Upstream switched virtualised list libraries in the Expo app.
