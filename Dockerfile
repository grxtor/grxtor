# syntax=docker/dockerfile:1

# ─────────────────────────────────────────
#  BASE — pnpm kurulu Node
# ─────────────────────────────────────────
FROM node:22-alpine AS base
# pnpm sürümü package.json'daki "packageManager" alanından okunur (corepack)
RUN corepack enable

# ─────────────────────────────────────────
#  DEPS — bağımlılıkları yükle (cache'li)
#  Sadece package.json / lockfile değişince
#  bu katman yeniden çalışır.
# ─────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# pnpm store'u Docker cache'e bağla → paketler yeniden indirilmez
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ─────────────────────────────────────────
#  BUILDER — projeyi derle
# ─────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ─────────────────────────────────────────
#  RUNNER — sadece gerekli dosyaları içeren
#  küçük production imajı (~100 MB)
# ─────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Güvenlik: root dışı kullanıcı
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Standalone çıktı
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

# Proje verisi (admin paneli buraya yazar)
# Dokploy'da bu klasörü volume olarak bağla: /app/data → kalıcı depolama
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
COPY --chown=nextjs:nodejs data/ /app/data/

# Blog icerigi (admin paneli buraya yazar) — yazilabilir olmasi gerekir
RUN mkdir -p /app/content && chown nextjs:nodejs /app/content
COPY --chown=nextjs:nodejs content/ /app/content/

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
