# ------------------------------
# 1. Build Stage
# ------------------------------
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build standalone Next.js app
RUN npm run build

# ------------------------------
# 2. Run Stage
# ------------------------------
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]