import express from 'express'

export default storage => {
  const router = express.Router()

  router.get('/:reviewee_email', async (req, res, next) => {
    try {
      const { params: { reviewee_email } } = req
      const result = await storage.getAverageRatingFor(reviewee_email)
      res
        .status(200)
        .json(result)
    } catch (error) {
      next(error)
    }
  })

  return router
}
