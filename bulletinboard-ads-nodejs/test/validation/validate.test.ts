import assert from 'assert/strict'
import { AdPayload, validateAd, validateId } from '../../src/lib/validation/validate.js'
import IllegalArgumentError from '../../src/lib/error/illegal-argument-error.js'
import { WOLLY_SOCKS } from '../data/ads.js'

describe('validate', () => {
  describe('validateId', () => {
    it('should throw an Error in case an invalid id is provided', () => {
      assert.throws(() => validateId('invalid'), IllegalArgumentError)
    })

    it('converts the id to a number, if possible', () => {
      const id = validateId('123')
      assert.equal(id, 123)
    })

    it('should throw an Error in case a negative id is provided', () => {
      assert.throws(() => validateId(-1), IllegalArgumentError)
    })
  })

  describe('validateAd', () => {
    it('should throw an Error in case an invalid ad is provided', () => {
      assert.throws(() => validateAd({}), IllegalArgumentError)
      Object.keys(WOLLY_SOCKS).forEach((key) => {
        const ad: AdPayload = {
          ...WOLLY_SOCKS,
          [key]: null
        }
        assert.throws(() => validateAd(ad), IllegalArgumentError)
      })
    })

    it('converts the price to a number, if possible', () => {
      const ad = validateAd({
        title: 'Shoes',
        contact: 'a@b.de',
        price: '50',
        currency: 'USD'
      })
      assert.equal(ad.price, 50)
    })
  })
})
