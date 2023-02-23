import express from 'express'
import PostgresReviewStorage from '../storage/postgres-review-storage.js'

export default (storage: PostgresReviewStorage) => {
  const router = express.Router()

  router.get('/:revieweeEmail', async (req, res, next) => {
    try {
      const { params: { revieweeEmail } } = req
      const result = await storage.getAverageRatingFor(revieweeEmail)
      res
        .status(200)
        .json(result)
    } catch (error) {
      next(error)
    }
  })

  return router
}
