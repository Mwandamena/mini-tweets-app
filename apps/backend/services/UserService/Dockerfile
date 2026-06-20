# ---------- BASE ----------
FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
RUN npm install -g turbo

# ---------- PRUNER ----------
FROM base AS pruner
COPY . .
RUN turbo prune @mta/user-service --docker

# ---------- INSTALLER ----------
FROM base AS installer
COPY --from=pruner /app/out/json .
# Layer 2 — install with persistent store cache
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    --mount=type=cache,id=prisma-engines,target=/root/.cache/prisma \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full .


RUN pnpm --filter=@mta/user-service exec prisma generate
RUN pnpm --filter=@mta/user-service... run build

RUN mkdir -p apps/backend/services/UserService/dist/db/generated/client && \
    cp apps/backend/services/UserService/src/db/generated/client/libquery_engine-*.so.node \
       apps/backend/services/UserService/dist/db/generated/client/


RUN test -f apps/backend/services/UserService/dist/user.js || \
    (echo "ERROR: dist/user.js not found after build" && exit 1)

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm --filter=@mta/user-service deploy --prod --legacy /app/deploy

# Copy prisma schema + migrations into deploy so runner has them
COPY --from=pruner /app/apps/backend/services/UserService/prisma /app/deploy/prisma

# ---------- RUNNER ----------
FROM node:22-slim AS runner
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production

COPY --from=installer /app/deploy/dist        ./dist
COPY --from=installer /app/deploy/node_modules ./node_modules
COPY --from=installer /app/deploy/package.json ./package.json
COPY --from=installer /app/deploy/prisma       ./prisma

EXPOSE 2001
CMD ["node", "dist/user.js"]