# -------- Runtime Stage --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY .next/server ./.next/server
COPY public ./public
COPY package*.json ./

RUN npm ci --omit=dev --prefer-offline --no-audit

EXPOSE 3001

CMD ["node", "--max-old-space-size=256", "server.js"]
