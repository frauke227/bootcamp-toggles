#!/bin/sh

docker build -t bulletinboard-ads-postgres - <<EOT
FROM postgres:12-alpine
RUN echo "CREATE DATABASE bulletinboard_ads_dev" >> /docker-entrypoint-initdb.d/init.sql
EOT

docker run --rm --platform linux/amd64 -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 bulletinboard-ads-postgres
