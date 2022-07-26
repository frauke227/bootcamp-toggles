import assert from 'assert/strict'
import sinon from 'sinon'
import supertest from 'supertest'
import { FIRST_REVIEW } from '../reviews.js'
import logger from '../../lib/util/logger.js'
import PostgresReviewStorage from '../../lib/storage/postgres-review-storage.js'
import application from '../../lib/application.js'

describe('average-rating-router', () => {
  const sandbox = sinon.createSandbox()

  let loggerStub = null
  let storageStub = null
  let client = null

  beforeEach(() => {
    loggerStub = sandbox.stub(logger)
    loggerStub.child.returnsThis()
    storageStub = sandbox.createStubInstance(PostgresReviewStorage)
    const app = application(storageStub, loggerStub)
    client = supertest(app)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('get /:revieweeEmail', () => {
    it('should read an ad', async () => {
      const expectedAverageRating = 13.37
      const { revieweeEmail } = FIRST_REVIEW
      storageStub
        .getAverageRatingFor
        .withArgs(revieweeEmail)
        .resolves({
          averageRating: expectedAverageRating
        })
      const { body } =
        await client
          .get(`/api/v1/averageRatings/${revieweeEmail}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      assert.deepEqual(body, {
        averageRating: expectedAverageRating
      })
    })
  })
})
