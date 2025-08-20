# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add git --no-cache \
    && apk add --no-cache libc6-compat \
    && npm install -g corepack@0.31.0 \
    && corepack enable \
    && corepack prepare pnpm@10.8.0 --activate
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-offline


# Rebuild the source code only when needed
FROM base AS builder
RUN apk add git --no-cache \
    && apk add --no-cache libc6-compat \
    && npm install -g corepack@0.31.0 \
    && corepack enable \
    && corepack prepare pnpm@10.8.0 --activate

# Accept build arguments for environment variables
ARG STAGE
ARG AUTH_URL
ARG NEXT_PUBLIC_APP_URL
ARG AUTH_SECRET
ARG AUTH_TRUST_HOST
ARG SKIP_ENV_VALIDATION
ARG NEXT_TELEMETRY_DISABLED

# Set environment variables from build args
ENV STAGE=${STAGE}
ENV AUTH_URL=${AUTH_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}
ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add git --no-cache \
    && apk add --no-cache libc6-compat \
    && apk add --no-cache curl \
    && npm install -g corepack@0.31.0 \
    && corepack enable \
    && corepack prepare pnpm@10.8.0 --activate

WORKDIR /app

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Create cache directories with proper ownership
USER root
RUN mkdir -p .next/cache/fetch-cache .next/cache/images && \
    chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["pnpm", "start"]
