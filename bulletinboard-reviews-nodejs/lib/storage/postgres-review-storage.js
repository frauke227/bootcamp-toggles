import util from 'util'
import IllegalArgumentError from '../error/illegal-argument-error.js'
import NotFoundError from '../error/not-found-error.js'

export default class PostgresReviewStorage {
  static EXISTS = 'SELECT EXISTS(SELECT 1 FROM reviews WHERE id=$1)'
  static CREATE = 'INSERT INTO reviews (reviewee_email, reviewer_email, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id'
  static READ_ALL = 'SELECT id, reviewee_email, reviewer_email, rating, comment FROM reviews'
  static READ_ALL_FOR = 'SELECT id, reviewee_email, reviewer_email, rating, comment FROM reviews WHERE reviewee_email = $1'
  static GET_AVERAGE_RATING_FOR = 'SELECT AVG(rating) AS "averageRating" FROM reviews WHERE reviewee_email = $1'
  static DELETE_ALL = 'DELETE FROM reviews'

  #log = null
  #pool = null

  constructor (pool, logger) {
    this.#log = logger.child({ module: 'postgres-review-storage' })
    this.#pool = pool
  }

  async #checkId (id) {
    this.#log.debug('Checking id: %s', id)
    if (!id || typeof id !== 'number' || id < 1) {
      const message = util.format('Invalid id: %s', id)
      throw new IllegalArgumentError(message)
    }
    const { rows: [{ exists }] } = await this.#pool.query(PostgresReviewStorage.EXISTS, [id])
    if (!exists) {
      const message = util.format('No review found for id: %s', id)
      throw new NotFoundError(message)
    }
  }

  #checkAd ({ reviewee_email, reviewer_email, rating, comment }) {
    this.#log.debug('Checking review: %O', { reviewee_email, reviewer_email, rating, comment })
    if (!reviewee_email || typeof reviewee_email !== 'string' ||
      !reviewer_email || typeof reviewer_email !== 'string' ||
      typeof rating !== 'number' || rating < 0 ||
      !comment || typeof comment !== 'string'
    ) {
      const message = util.format('Invalid review: %O', { reviewee_email, reviewer_email, rating, comment })
      throw new IllegalArgumentError(message)
    }
  }

  async create ({ reviewee_email = '', reviewer_email = '', rating = 0, comment = '' } = {}) {
    try {
      this.#log.debug('Creating review: %O', { reviewee_email, reviewer_email, rating, comment })
      this.#checkAd({ reviewee_email, reviewer_email, rating, comment })
      const { rows: [{ id }] } = await this.#pool.query(PostgresReviewStorage.CREATE, [reviewee_email, reviewer_email, rating, comment])
      this.#log.debug('Successfully created review: %O - %d', { reviewee_email, reviewer_email, rating, comment }, id)
      return id
    } catch (error) {
      const { message } = error
      this.#log.error('Error creating review: %O - %s', { reviewee_email, reviewer_email, rating, comment }, message)
      throw error
    }
  }

  async readAll () {
    try {
      this.#log.debug('Reading all reviews')
      const { rows } = await this.#pool.query(PostgresReviewStorage.READ_ALL)
      this.#log.debug('Successfully read all reviews - %O', rows)
      return rows
    } catch (error) {
      const { message } = error
      this.#log.error('Error reading all reviews - %s', message)
      throw error
    }
  }

  async readAllFor (reviewee_email) {
    try {
      this.#log.debug('Reading all reviews for %s', reviewee_email)
      const { rows } = await this.#pool.query(PostgresReviewStorage.READ_ALL_FOR, [reviewee_email])
      this.#log.debug('Successfully read all reviews for %s - %O', reviewee_email, rows)
      return rows
    } catch (error) {
      const { message } = error
      this.#log.error('Error reading all reviews for %s - %s', reviewee_email, message)
      throw error
    }
  }

  async getAverageRatingFor (reviewee_email) {
    try {
      this.#log.debug('Getting average rating for %s', reviewee_email)
      const { rows: [{ averageRating }] } = await this.#pool.query(PostgresReviewStorage.GET_AVERAGE_RATING_FOR, [reviewee_email])
      this.#log.debug('Successfully got average rating for %s - %d', reviewee_email, averageRating)
      return { averageRating: parseFloat(averageRating) }
    } catch (error) {
      const { message } = error
      this.#log.error('Error getting average rating for %s - %s', reviewee_email, message)
      throw error
    }
  }

  async deleteAll () {
    try {
      this.#log.debug('Deleting all reviews')
      await this.#pool.query(PostgresReviewStorage.DELETE_ALL)
      this.#log.debug('Successfully deleted all reviews')
    } catch ({ message }) {
      this.#log.error('Error deleting all reviews - %s', message)
      throw new Error(message)
    }
  }
}
