import assert from 'assert/strict'
import { ReviewPayload, validateReview, validateRevieweeEmail } from '../../src/lib/validation/validate.js'
import IllegalArgumentError from '../../src/lib/error/illegal-argument-error.js'
import { FIRST_REVIEW } from '../data/reviews.js'

describe('validate', () => {
  describe('validateRevieweeEmail', () => {
    it('should be valid for a valid revieweeEmail', () => {
      assert.equal(validateRevieweeEmail('john.doe@example.com'), 'john.doe@example.com')
    })

    it('should throw an Error in case an invalid revieweeEmail is provided', () => {
      assert.throws(() => validateRevieweeEmail('john'), IllegalArgumentError)
      assert.throws(() => validateRevieweeEmail('123'), IllegalArgumentError)
      assert.throws(() => validateRevieweeEmail(567), IllegalArgumentError)
      assert.throws(() => validateRevieweeEmail(true), IllegalArgumentError)
      assert.throws(() => validateRevieweeEmail(null), IllegalArgumentError)
      assert.throws(() => validateRevieweeEmail(undefined), IllegalArgumentError)
    })
  })

  describe('validateReview', () => {
    it('should throw an Error in case an invalid review is provided', () => {
      assert.throws(() => validateReview({}), IllegalArgumentError)
      Object.keys(FIRST_REVIEW).forEach((key) => {
        if (key !== 'rating') {
          const review: ReviewPayload = {
            ...FIRST_REVIEW,
            [key]: null
          }
          assert.throws(() => validateReview(review), IllegalArgumentError)
        }
      })
    })

    it('converts the rating to a number, if possible', () => {
      const review = validateReview({
        revieweeEmail: 'john.doe@some.org',
        reviewerEmail: 'frank.foe@other.org',
        rating: '5',
        comment: 'Everythings fine'
      })
      assert.equal(review.rating, 5)
    })
  })
})
