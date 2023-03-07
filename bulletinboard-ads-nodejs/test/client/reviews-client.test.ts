import assert from 'assert/strict'
import sinon, { SinonStubbedInstance, SinonStub } from 'sinon'
import { Logger } from 'winston'
import logger from '../../src/lib/util/logger.js'
import ReviewsClient from '../../src/lib/client/reviews-client.js'

const REVIEWS_ENDPOINT = 'http://localhost:9090'
const AVERAGE_RATING = 3.1415

describe('reviews-client', () => {
  let fetchStub: SinonStub
  let loggerStub: SinonStubbedInstance<Logger>
  let reviewsClient: ReviewsClient

  beforeEach(() => {
    fetchStub = sinon.stub()
    loggerStub = sinon.stub(logger)
    loggerStub.child.returnsThis()
    reviewsClient = new ReviewsClient(fetchStub, REVIEWS_ENDPOINT, loggerStub)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should get the reviews endpoint', () => {
    const endpoint = reviewsClient.getEndpoint()
    assert.equal(endpoint, REVIEWS_ENDPOINT)
  })

  it('should get the average rating for a contact', async () => {
    const contact = 'foo@bar.de'
    const jsonStub = sinon.stub().resolves({ averageRating: AVERAGE_RATING })
    fetchStub
      .withArgs(`${REVIEWS_ENDPOINT}/api/v1/averageRatings/${contact}`)
      .resolves({
        json: jsonStub
      })
    const averageRating = await reviewsClient.getAverageRating(contact)
    assert.equal(averageRating, AVERAGE_RATING)
  })
})
