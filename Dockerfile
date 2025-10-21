# ----------- Build Stage -----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------- Runtime Stage -----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev --prefer-offline --no-audit

EXPOSE 3001
CMD ["node", "server.js"]
