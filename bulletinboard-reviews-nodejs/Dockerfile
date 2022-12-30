FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY index-k8s.js ./
COPY lib ./lib/
COPY migrations ./migrations/
COPY public ./public/

EXPOSE 9090

CMD [ "node", "index-k8s.js" ]
