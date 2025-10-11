# ----------- Runtime Stage (no build interno) -----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia solo lo necesario desde tu proyecto local
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --omit=dev

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
