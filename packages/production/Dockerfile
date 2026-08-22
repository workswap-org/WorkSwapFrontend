FROM node:22-alpine

WORKDIR /app

COPY .next/standalone/packages/production ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]