# ---------- BASE ----------
FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
RUN npm install -g turbo

# ---------- PRUNER ----------
FROM base AS pruner
COPY . .
RUN turbo prune @mta/api-gateway --docker

# ---------- INSTALLER ----------
FROM base AS installer

# Layer 1 — manifests only (cached until lockfile/package.json changes)
COPY --from=pruner /app/out/json .

# Layer 2 — install with persistent store cache
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Layer 3 — source (busts on code change, but install layer above stays cached)
COPY --from=pruner /app/out/full .

# Layer 4 — build
RUN pnpm --filter=@mta/api-gateway... run build
RUN test -f apps/backend/services/ApiGateway/dist/index.js || \
    (echo "ERROR: dist/index.js not found after build" && exit 1)

# Layer 5 — deploy with cache
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm --filter=@mta/api-gateway deploy --prod --legacy /app/deploy

# ---------- RUNNER ----------
FROM node:22-slim AS runner
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
COPY --from=installer /app/deploy/dist         ./dist
COPY --from=installer /app/deploy/node_modules ./node_modules
COPY --from=installer /app/deploy/package.json ./package.json
EXPOSE 2000
CMD ["node", "dist/index.js"]