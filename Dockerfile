# ──────────────────────────────────────────────
#  Stage 1 – Install dependencies
# ──────────────────────────────────────────────
FROM ubuntu:22.04 AS deps

RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Copy only package manifests first for better layer caching
COPY package.json bun.lock ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# ──────────────────────────────────────────────
#  Stage 2 – Production image
# ──────────────────────────────────────────────
FROM ubuntu:22.04 AS runner

RUN apt-get update && apt-get install -y curl wget && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

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
