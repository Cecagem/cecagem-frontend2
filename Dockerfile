# -------- Runtime Stage --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY package*.json ./

RUN npm ci --omit=dev --prefer-offline --no-audit

CMD ["node", "--max-old-space-size=256", "server.js"]

EXPOSE 3001
