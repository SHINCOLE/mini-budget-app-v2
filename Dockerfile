# ------------------------------
# 1. Build Stage
# ------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Use npm install (more stable on Jenkins VM)
RUN npm install --legacy-peer-deps --verbose

# Copy full project
COPY . .

# Build standalone Next.js output
RUN npm run build

# ------------------------------
# 2. Run Stage
# ------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone output (Next.js standalone build)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]