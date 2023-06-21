import fetch from 'node-fetch'
import pg from 'pg'
import PostgresAdStorage from './storage/postgres-ad-storage.js'
import ReviewsClient from './client/reviews-client.js'
import logger from './util/logger.js'
import application from './application.js'
import migrate from './storage/migrate-api.js'

export type Config = {
  app: {
    port: number
  },
  postgres: {
    connectionString: string
  },
  reviews: {
    endpoint: string
  }
  toggle: {
    isOrderByNoOfViewsEnabled: boolean
  }
}

export default async function main(config: Config) {
  const { app: { port }, postgres, reviews: { endpoint } } = config

  const log = logger.child({ module: 'server' })

  await migrate(postgres).up()
  const pool = new pg.Pool(postgres)
  const storage = new PostgresAdStorage(pool, logger)
  const reviewsClient = new ReviewsClient(fetch, endpoint, logger)
  const app = application(storage, reviewsClient, logger, config)

  app
    .listen(port, () => log.info('Server is listening on http://localhost:%d', port))
    .on('error', ({ message }) => log.error('Error starting server: %s', message))

  // const shutdown = () => {
  //   // TODO: shutdown the server and the database connection gracefully
  // }

  // process.on('SIGINT', () => shutdown())
  // process.on('SIGTERM', () => shutdown())
}
