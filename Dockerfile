# ──────────────────────────────────────────────
#  Stage 1 – Install dependencies
# ──────────────────────────────────────────────
FROM node:22-slim AS deps

# Enable pnpm via corepack (built into Node 16.13+)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only package manifests first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# ──────────────────────────────────────────────
#  Stage 2 – Production image
# ──────────────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

# Create a non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY package.json ./
COPY src ./src
COPY public ./public

# Create uploads directory for multer (writable by appuser)
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the app port (defaults to 7000 in .env.example)
EXPOSE 7000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-7000}/health || exit 1

# Start the server
CMD ["node", "src/index.js"]
