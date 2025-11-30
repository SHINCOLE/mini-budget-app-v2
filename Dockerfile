# ------------------------------
# 1. Build Stage
# ------------------------------
FROM node:20 AS builder
WORKDIR /app

# Avoid interactive prompts and speed up installs
ENV CI=true
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Copy lockfile first to leverage Docker cache for npm installs
COPY package.json package-lock.json ./

# Use prefer-offline and no-audit to speed up CI installs
RUN npm ci --no-audit --prefer-offline --no-fund

# Copy app source and build
COPY . .
# Ensure Next knows to look for .env.local/.env if you need them in build
# (Your pipeline already copies .env/.env.local before build)
RUN npm run build

# ------------------------------
# 2. Run Stage
# ------------------------------
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# copy only the Next standalone output + static assets
# (Next's "standalone" output must be enabled by Next build configuration)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# If your standalone uses `server.js`, keep node server.js
# If your app uses a different entrypoint, update accordingly
CMD ["node", "server.js"]