# ── Next.js frontend ────────────────────────────────────────────────────────
# Build args:
#   DATABASE_URL    — required at build time: doctor pages are statically
#                     generated from the database during `next build`.
#   BACKEND_ORIGIN  — where /api/* rewrites point (compose sets the service DNS).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL
ARG BACKEND_ORIGIN=http://backend:8020
ENV DATABASE_URL=$DATABASE_URL \
    BACKEND_ORIGIN=$BACKEND_ORIGIN \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
