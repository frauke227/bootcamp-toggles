import assert from 'assert/strict'
import sinon from 'sinon'
import logger from '../../lib/util/logger.js'
import ReviewsClient from '../../lib/client/reviews-client.js'

const REVIEWS_ENDPOINT = 'http://localhost:9090'
const AVERAGE_RATING = 3.1415

describe('reviews-client', () => {
  const sandbox = sinon.createSandbox()

  let fetchStub = null
  let loggerStub = null
  let reviewsClient = null

  beforeEach(() => {
    fetchStub = sandbox.stub()
    loggerStub = sandbox.stub(logger)
    loggerStub.child.returnsThis()
    reviewsClient = new ReviewsClient(fetchStub, REVIEWS_ENDPOINT, loggerStub)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should create a reviews client', () => {
    assert.ok(reviewsClient instanceof ReviewsClient)
  })

  it('should get the reviews endpoint', () => {
    const endpoint = reviewsClient.getEndpoint()
    assert.equal(endpoint, REVIEWS_ENDPOINT)
  })

  it('should get the average rating for a contact', async () => {
    const contact = 'foo@bar.de'
    const jsonStub = sandbox.stub().resolves({ average_rating: AVERAGE_RATING })
    fetchStub
      .withArgs(`${REVIEWS_ENDPOINT}/api/v1/averageRatings/${contact}`)
      .resolves({
        json: jsonStub
      })
    const averageRating = await reviewsClient.getAverageRating(contact)
    assert.equal(averageRating, AVERAGE_RATING)
  })
})
