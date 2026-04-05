# ============================================
# STAGE 1: Install Dependencies
# ============================================
FROM oven/bun:1 AS deps

WORKDIR /app

# Copy file dependency descriptor
COPY package.json bun.lock ./

# Install dependencies (production only)
RUN bun install --frozen-lockfile

# ============================================
# STAGE 2: Build Aplikasi
# ============================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Accept build arguments for public env vars
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_URL

# Copy dependencies dari stage sebelumnya
COPY --from=deps /app/node_modules ./node_modules

# Copy seluruh source code
COPY . .

# Set environment untuk build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Build Next.js (output: standalone)
RUN bun run build

# ============================================
# STAGE 3: Production Image (Runtime)
# ============================================
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Set environment runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Buat user non-root untuk keamanan
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy file-file hasil build yang dibutuhkan saja
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Gunakan user non-root
USER nextjs

# Expose port
EXPOSE 3000

# Set port via env
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan aplikasi
CMD ["bun", "server.js"]
