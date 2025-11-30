# ------------------------------
# 1. Build Stage
# ------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install required system packages (important!)
RUN apt-get update && apt-get install -y \
    libc6 \
    libc6-dev \
    libstdc++6 \
    python3 \
    build-essential \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy only deps first (for caching)
COPY package.json package-lock.json ./

# Install dependencies cleanly (no cache)
RUN npm ci

# Copy all project files
COPY . .

# Build Next.js in standalone mode
RUN npm run build


# ------------------------------
# 2. Runner Stage
# ------------------------------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the standalone build (this contains server.js + minimal node_modules)
COPY --from=builder /app/.next/standalone ./

# Static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]