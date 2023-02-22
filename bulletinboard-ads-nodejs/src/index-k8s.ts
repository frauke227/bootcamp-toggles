import main, { Config } from './lib/main.js'

if (!process.env.PORT) {
  throw new Error('Env variable PORT not specified')
}

if (!process.env.POSTGRES_CONNECTION_STRING) {
  throw new Error('Env variable POSTGRES_CONNECTION_STRING not specified')
}

if (!process.env.REVIEWS_ENDPOINT) {
  throw new Error('Env variable REVIEWS_ENDPOINT not specified')
}

const config: Config = {
  app: {
    port: Number.parseInt(process.env.PORT)
  },
  postgres: {
    connectionString: process.env.POSTGRES_CONNECTION_STRING
  },
  reviews: {
    endpoint: process.env.REVIEWS_ENDPOINT
  }
}

main(config)
