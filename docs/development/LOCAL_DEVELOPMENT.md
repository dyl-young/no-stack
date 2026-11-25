# Adding a feature

Define application tables in packages/db/src/schema. Generate and inspect a migration before applying it. Keep server queries and authorization in packages/api. Expose narrow typed results to both clients. Add web and native routes that use the same contract. The existing account tests demonstrate injecting a verified user and exercising unauthorized access.
