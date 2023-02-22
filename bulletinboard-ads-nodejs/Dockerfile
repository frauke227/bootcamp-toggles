# Build step
FROM node:16-alpine as builder

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY migrations ./migrations/
COPY src ./src/

RUN npm run build


# Production image
FROM node:16-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder dist/ dist/
COPY migrations ./migrations/
COPY public ./public/

EXPOSE 8080

ENTRYPOINT [ "node", "dist/src/index-k8s.js" ]
