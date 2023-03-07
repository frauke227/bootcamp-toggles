import assert from 'assert/strict'
import sinon, { SinonStubbedInstance } from 'sinon'
import logger from '../../src/lib/util/logger.js'
import pg from 'pg'
import { Logger } from 'winston'
import PostgresReviewStorage from '../../src/lib/storage/postgres-review-storage.js'
import { FIRST_REVIEW, SECOND_REVIEW } from '../data/reviews.js'
import migrate from '../../src/lib/storage/migrate-api.js'

describe('postgres-review-storage', () => {
  const connectionString = 'postgresql://postgres:postgres@localhost:6543/postgres'

  let loggerStub: SinonStubbedInstance<Logger>
  let pool: pg.Pool
  let storage: PostgresReviewStorage

  before(async () => {
    await migrate({ connectionString }).up()
    pool = new pg.Pool({ connectionString })
  })

  beforeEach(() => {
    loggerStub = sinon.stub(logger)
    loggerStub.child.returnsThis()
    storage = new PostgresReviewStorage(pool, loggerStub)
  })

  afterEach(async () => {
    await storage.deleteAll()
    sinon.restore()
  })

  after(async () => {
    await pool.end()
  })

  describe('create', () => {
    it('should create a review', async () => {
      const id = await storage.create(FIRST_REVIEW)
      const ads = await storage.readAll()
      assert.equal(ads.length, 1)
      assert.deepEqual(ads, [{
        id,
        ...FIRST_REVIEW
      }])
    })
  })

  describe('readAll', () => {
    it('should read all reviews', async () => {
      const firstId = await storage.create(FIRST_REVIEW)
      const secondId = await storage.create(SECOND_REVIEW)
      const reviews = await storage.readAll()
      assert.equal(reviews.length, 2)
      assert.deepEqual(reviews, [
        {
          id: firstId,
          ...FIRST_REVIEW
        },
        {
          id: secondId,
          ...SECOND_REVIEW
        }
      ])
    })
  })

  describe('readAllFor', () => {
    it('should read all reviews', async () => {
      const { revieweeEmail } = FIRST_REVIEW
      const id = await storage.create(FIRST_REVIEW)
      const reviews = await storage.readAllFor(revieweeEmail)
      assert.equal(reviews.length, 1)
      assert.deepEqual(reviews, [
        {
          id,
          ...FIRST_REVIEW
        }
      ])
    })
  })

  describe('getAverageRatingFor', () => {
    it('should get the average rating', async () => {
      const { rating, revieweeEmail } = SECOND_REVIEW
      await Promise.all([
        storage.create(SECOND_REVIEW),
        storage.create(SECOND_REVIEW),
        storage.create(SECOND_REVIEW)
      ])
      const { averageRating: actualAverageRating } = await storage.getAverageRatingFor(revieweeEmail)
      assert.equal(actualAverageRating, rating)
    })
  })

  describe('deleteAll', () => {
    it('should delete all reviews', async () => {
      await Promise.all([
        storage.create(SECOND_REVIEW),
        storage.create(SECOND_REVIEW),
        storage.create(SECOND_REVIEW)
      ])
      await storage.deleteAll()
      const reviews = await storage.readAll()
      assert.equal(reviews.length, 0)
      assert.deepEqual(reviews, [])
    })
  })
})
