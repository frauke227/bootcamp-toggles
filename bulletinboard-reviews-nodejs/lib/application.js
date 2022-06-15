import { STATUS_CODES } from 'http'
import express from 'express'
import reviewRouter from './router/review-router.js'
import averageRatingRouter from './router/average-rating-router.js'
import NotImplementedError from './error/not-implemented-error.js'

export default (storage, logger) => {
  const log = logger.child({ module: 'application' })

  const app = express()

  app.use(express.static('public'))

  app.use((req, res, next) => {
    const { method, url } = req
    log.http('%s %s', method, url)
    next()
  })

  app.get('/health', (req, res) => {
    res
      .status(200)
      .type('text/plain')
      .send('OK')
  })

  app.use('/api/v1/reviews', reviewRouter(storage))

  app.use('/api/v1/averageRatings', averageRatingRouter(storage))

  app.use((req, res, next) => {
    const error = new NotImplementedError()
    next(error)
  })

  app.use((error, req, res, _next) => {
    const defaultCode = 500
    const { code = defaultCode, message } = error
    const { method, url } = req
    log.error('Error %s %s - %s', method, url, message)
    const status = STATUS_CODES?.[code] ?? STATUS_CODES[defaultCode]
    res
      .status(code)
      .type('text/plain')
      .send(status)
  })

  return app
}
