import main from './lib/main.js'

const config = {
  app: {
    port: process.env.PORT
  },
  postgres: {
    connectionString: process.env.POSTGRES_CONNECTION_STRING
  },
  reviews: {
    endpoint: process.env.REVIEWS_ENDPOINT
  }
}

main(config)
