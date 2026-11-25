FROM node:24.16.0-bookworm-slim AS build
WORKDIR /workspace
RUN npm install --global pnpm@10.20.0
COPY . .
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile --filter @no-stack/nextjs... && pnpm --filter @no-stack/db build && pnpm --filter @no-stack/api build && pnpm --filter @no-stack/nextjs build

FROM node:24.16.0-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=8080
COPY --from=build --chown=node:node /workspace/apps/nextjs/.next/standalone ./
COPY --from=build --chown=node:node /workspace/apps/nextjs/.next/static ./apps/nextjs/.next/static
COPY --from=build --chown=node:node /workspace/apps/nextjs/public ./apps/nextjs/public
USER node
CMD ["node", "apps/nextjs/server.js"]
