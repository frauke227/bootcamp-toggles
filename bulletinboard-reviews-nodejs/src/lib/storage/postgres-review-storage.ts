import pg from 'pg'
import { Logger } from 'winston'
import { Review } from '../validation/validate.js'

type AverageRating = {
  averageRating: number
}

export default class PostgresReviewStorage {
  static CREATE = 'INSERT INTO reviews ("revieweeEmail", "reviewerEmail", rating, comment) VALUES ($1, $2, $3, $4) RETURNING *'
  static READ_ALL = 'SELECT id, "revieweeEmail", "reviewerEmail", rating, comment FROM reviews'
  static READ_ALL_FOR = 'SELECT id, "revieweeEmail", "reviewerEmail", rating, comment FROM reviews WHERE "revieweeEmail" = $1'
  static GET_AVERAGE_RATING_FOR = 'SELECT AVG(rating) AS "averageRating" FROM reviews WHERE "revieweeEmail" = $1'
  static DELETE_ALL = 'DELETE FROM reviews'

  private logger: Logger
  private pool: pg.Pool

  constructor(pool: pg.Pool, logger: Logger) {
    this.logger = logger.child({ module: 'postgres-review-storage' })
    this.pool = pool
    this.pool.on('error', ({ message }) => {
      this.logger.error('Error raised by pg client: %s', message)
    })
  }

  async create({ revieweeEmail = '', reviewerEmail = '', rating = 0, comment = '' } = {}) {
    try {
      this.logger.debug('Creating review: %O', { revieweeEmail, reviewerEmail, rating, comment })
      const { rows: [review] } = await this.pool.query<Review>(PostgresReviewStorage.CREATE, [revieweeEmail, reviewerEmail, rating, comment])
      this.logger.debug('Successfully created review: %O - %d', { revieweeEmail, reviewerEmail, rating, comment }, review.id)
      return review.id
    } catch (error) {
      const { message } = error as Error
      this.logger.error('Error creating review: %O - %s', { revieweeEmail, reviewerEmail, rating, comment }, message)
      throw error
    }
  }

  async readAll() {
    try {
      this.logger.debug('Reading all reviews')
      const { rows } = await this.pool.query<Review>(PostgresReviewStorage.READ_ALL)
      this.logger.debug('Successfully read all reviews - %O', rows)
      return rows
    } catch (error) {
      const { message } = error as Error
      this.logger.error('Error reading all reviews - %s', message)
      throw error
    }
  }

  async readAllFor(revieweeEmail: string) {
    try {
      this.logger.debug('Reading all reviews for %s', revieweeEmail)
      const { rows } = await this.pool.query<Review>(PostgresReviewStorage.READ_ALL_FOR, [revieweeEmail])
      this.logger.debug('Successfully read all reviews for %s - %O', revieweeEmail, rows)
      return rows
    } catch (error) {
      const { message } = error as Error
      this.logger.error('Error reading all reviews for %s - %s', revieweeEmail, message)
      throw error
    }
  }

  async getAverageRatingFor(revieweeEmail: string): Promise<AverageRating> {
    try {
      this.logger.debug('Getting average rating for %s', revieweeEmail)
      const { rows: [rating] } = await this.pool.query(PostgresReviewStorage.GET_AVERAGE_RATING_FOR, [revieweeEmail])
      this.logger.debug('Successfully got average rating for %s - %d', revieweeEmail, rating.averageRating)
      return { averageRating: parseFloat(rating.averageRating) }
    } catch (error) {
      const { message } = error as Error
      this.logger.error('Error getting average rating for %s - %s', revieweeEmail, message)
      throw error
    }
  }

  async deleteAll() {
    try {
      this.logger.debug('Deleting all reviews')
      await this.pool.query(PostgresReviewStorage.DELETE_ALL)
      this.logger.debug('Successfully deleted all reviews')
    } catch (error) {
      const { message } = error as Error
      this.logger.error('Error deleting all reviews - %s', message)
      throw new Error(message)
    }
  }
}
