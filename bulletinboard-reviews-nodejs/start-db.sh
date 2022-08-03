#!/bin/sh

docker build -t bulletinboard-reviews-postgres - <<EOT
FROM postgres:12-alpine
RUN echo "CREATE DATABASE bulletinboard_reviews_dev" >> /docker-entrypoint-initdb.d/init.sql
EOT

docker run --rm --platform linux/amd64 -e POSTGRES_HOST_AUTH_METHOD=trust -p 6543:5432 bulletinboard-reviews-postgres
