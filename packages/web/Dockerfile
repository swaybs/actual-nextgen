# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Enable corepack for yarn
RUN corepack enable

# Copy workspace root files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Copy package.json files for all workspace packages
# (needed for yarn to resolve workspace dependencies)
COPY packages/web/package.json packages/web/
COPY packages/loot-core/package.json packages/loot-core/
COPY packages/crdt/package.json packages/crdt/
COPY packages/api/package.json packages/api/

# Install dependencies
RUN yarn install --immutable

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/package.json ./
COPY --from=deps /app/yarn.lock ./
COPY --from=deps /app/.yarnrc.yml ./

# Copy source code
COPY packages/web packages/web
COPY packages/loot-core packages/loot-core
COPY packages/crdt packages/crdt
COPY packages/api packages/api
COPY tsconfig.json ./

# Build loot-core first (dependency)
RUN yarn workspace loot-core build:browser

# Build the Next.js app
RUN yarn workspace @actual-app/nextgen build

# Stage 3: Runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder /app/packages/web/public ./packages/web/public

# Create data directory for SQLite
RUN mkdir -p /data && chown nextjs:nodejs /data
VOLUME /data

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "packages/web/server.js"]
