import fetch from 'node-fetch'
import config from './lib/util/config.js'
import Pool from './lib/storage/pool.js'
import PostgresAdStorage from './lib/storage/postgres-ad-storage.js'
import ReviewsClient from './lib/client/reviews-client.js'
import logger from './lib/util/logger.js'
import application from './lib/application.js'

const { app: { port }, postgres, reviews: { endpoint } } = config

const log = logger.child({ module: 'server' })

const pool = new Pool(postgres)
const storage = new PostgresAdStorage(pool, logger)
const reviewsClient = new ReviewsClient(fetch, endpoint, logger)
const app = application(storage, reviewsClient, logger)

app
  .listen(port, () => log.info('Server is listening on http://localhost:%d', port))
  .on('error', ({ message }) => log.error('Error starting server: %s', message))

// const shutdown = () => {
//   // TODO: shutdown the server and the database connection gracefully
// }

// process.on('SIGINT', () => shutdown())
// process.on('SIGTERM', () => shutdown())
