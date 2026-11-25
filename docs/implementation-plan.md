# Minimal personal app starter

Base the implementation on main at 0e93c94. This branch targets freshly generated projects. Existing installations must retain their migration history and link password users before changing auth settings.

1. **Thin the base.** Remove the posts vertical, unused controls, sample queries, editable profiles, storage and feature dependencies. Keep Next, Expo Router, shared tRPC, PostgreSQL/Drizzle and a single account contract. The initial database has no product tables.
2. **Implement Google-only account parity.** The first OAuth login creates an account. Both clients show provider identity, sign out, and confirm permanent deletion. Handle cancellation, session changes and provider errors. Test authorization and deletion with two distinct identities.
3. **Make setup portable.** Provide idempotent environment setup, explicit web/device endpoints, explicit PostgreSQL connectivity, and a local development build. Keep deployment credentials out of normal build checks.
4. **Validate the baseline.** Pin the runtime and dependency graph. Run formatting, lint, types, account tests, a production web build, a cold-cache restore and both native exports. Exercise OAuth on real devices with a registered Google client before release.
5. **Evaluate alternatives after this baseline.** Trial a shared Expo Router account screen on web and compare accessibility, deep links, cold entry, native launch and the effort of changing a shared field. Assess Vite/Redact independently for a browser-heavy project. Use a greenfield, costed Cloud Run/Cloud SQL pilot if GCP hosting becomes a priority. Add a streaming agent endpoint when a project needs it.

## Verification · 25 November

The isolated branch implements the fresh-project baseline on Next 16.4.6 and a newly built Expo SDK 58 shell. Local checks passed for account authorization and deletion errors, lint, types, formatting, production web compilation and native production JS exports. A repeat run of named-project setup preserved the existing environment file. Local Turbo cache hits restored the API and database declaration outputs after removing the generated directories.

Release checks still open:

- Update the audited dependency graph and align the three Expo native peers. The first online audit recorded 37 high and one critical finding, including an Expo CLI transitive dependency. The subsequent dependency refresh was blocked by automatic approval review. The audit is still enforced in CI.
- Run live Google OAuth, cancellation, session restoration, account switching and deletion on web and real native development builds. A native JS export does not verify native compilation or provider callbacks.
- Run the Node-container/PostgreSQL CI job. The local Docker daemon was unavailable. A developer can run account unit tests offline. Exercising the full local Google flow without registered credentials still needs a local test identity provider.
- Measure setup and interactive performance on the working auth baseline before evaluating alternative renderers and cloud deployments.

The production HTML for sign-in references 150,770 bytes of JavaScript and 200 bytes of CSS after local Brotli compression. The dashboard references 153,648 and 200 bytes respectively. These totals count each referenced asset once per route. A browser trace is still needed for actual transfer and interaction timings. Metro reported a 3.7 MB Hermes bundle for each native platform.
