import assert from 'assert/strict'
import util from 'util'
import sinon from 'sinon'
import logger from '../../lib/util/logger.js'
import Pool from '../../lib/storage/pool.js'
import PostgresAdStorage from '../../lib/storage/postgres-ad-storage.js'
import IllegalArgumentError from '../../lib/error/illegal-argument-error.js'
import NotFoundError from '../../lib/error/not-found-error.js'
import { WOLLY_SOCKS, USED_SHOES } from '../data/ads.js'
import migrate from '../../lib/storage/migrate-api.js'

describe('postgres-ad-storage', () => {
  const sandbox = sinon.createSandbox()
  const connectionString = 'postgresql://postgres:postgres@localhost:5432/postgres'

  let pool = null
  let loggerStub = null
  let storage = null

  before(async () => {
    await migrate({ connectionString }).up()
    pool = new Pool({ connectionString })
  })

  beforeEach(async () => {
    loggerStub = sandbox.stub(logger)
    loggerStub.child.returnsThis()
    storage = new PostgresAdStorage(pool, loggerStub)
  })

  afterEach(async () => {
    await storage.deleteAll()
    sandbox.restore()
  })

  after(async () => {
    await pool.end()
  })

  describe('create', () => {
    it('should reject with an error when creating an invalid ad', async () => {
      for (const key of Object.keys(WOLLY_SOCKS)) {
        const invalid = {
          [key]: null
        }
        const invalidAd = {
          ...WOLLY_SOCKS,
          ...invalid
        }
        const message = util.format('Invalid ad: %O', invalidAd)
        const error = new IllegalArgumentError(message)
        await assert.rejects(storage.create(invalidAd), error)
      }
    })

    it('should create an ad', async () => {
      const id = await storage.create(WOLLY_SOCKS)
      const ads = await storage.readAll()
      assert.equal(ads.length, 1)
      assert.deepEqual(ads, [{
        id,
        ...WOLLY_SOCKS
      }])
    })
  })

  describe('read', () => {
    it('should reject with an error when reading an invalid id', async () => {
      const id = 'invalid'
      const message = util.format('Invalid id: %s', id)
      const error = new IllegalArgumentError(message)
      await assert.rejects(storage.read(id), error)
    })

    it('should reject with an error when reading a non-existing ad', async () => {
      const id = 42
      const message = util.format('No ad found for id: %s', id)
      const error = new NotFoundError(message)
      await assert.rejects(storage.read(id), error)
    })

    it('should read an ad', async () => {
      const id = await storage.create(WOLLY_SOCKS)
      const ad = await storage.read(id)
      assert.deepEqual(ad, {
        id,
        ...WOLLY_SOCKS
      })
    })
  })

  describe('readAll', () => {
    it('should read all ads', async () => {
      const [id1, id2] = await Promise.all([
        storage.create(WOLLY_SOCKS),
        storage.create(USED_SHOES)
      ])
      const ads = await storage.readAll()
      assert.equal(ads.length, 2)
      assert.deepEqual(ads, [
        {
          id: id1,
          ...WOLLY_SOCKS
        },
        {
          id: id2,
          ...USED_SHOES
        }
      ])
    })
  })

  describe('update', () => {
    it('should reject with an error when updating an invalid id', async () => {
      const id = 'invalid'
      const message = util.format('Invalid id: %s', id)
      const error = new IllegalArgumentError(message)
      await assert.rejects(storage.update(id, { price: 10 }), error)
    })

    it('should reject with an error when updating a non-existing ad', async () => {
      const id = 42
      const message = util.format('No ad found for id: %s', id)
      const error = new NotFoundError(message)
      await assert.rejects(storage.update(id, { price: 10 }), error)
    })

    it('should reject with an error when updating an invalid ad', async () => {
      const id = await storage.create(WOLLY_SOCKS)
      for (const key of Object.keys(WOLLY_SOCKS)) {
        const invalid = {
          [key]: null
        }
        const invalidAd = {
          ...WOLLY_SOCKS,
          ...invalid
        }
        const message = util.format('Invalid ad: %O', invalidAd)
        const error = new IllegalArgumentError(message)
        await assert.rejects(storage.update(id, invalidAd), error)
      }
    })

    it('should update an ad', async () => {
      const id = await storage.create(WOLLY_SOCKS)
      const update = {
        ...WOLLY_SOCKS,
        price: 10
      }
      await storage.update(id, update)
      const ad = await storage.read(id)
      assert.deepEqual(ad, {
        id,
        ...update
      })
    })
  })

  describe('delete', () => {
    it('should reject with an error when deleting an invalid id', async () => {
      const id = 'invalid'
      const message = util.format('Invalid id: %s', id)
      const error = new IllegalArgumentError(message)
      await assert.rejects(storage.delete(id), error)
    })

    it('should reject with an error when deleting a non-existing ad', async () => {
      const id = 42
      const message = util.format('No ad found for id: %s', id)
      await assert.rejects(storage.delete(id), new NotFoundError(message))
    })

    it('should delete an ad', async () => {
      const id = await storage.create(WOLLY_SOCKS)
      await storage.delete(id)
      await assert.rejects(() => storage.read(id), NotFoundError)
    })
  })

  describe('deleteAll', () => {
    it('should delete all ads', async () => {
      await Promise.all([
        storage.create(WOLLY_SOCKS),
        storage.create(USED_SHOES)
      ])
      let ads = await storage.readAll()
      assert.equal(ads.length, 2)
      await storage.deleteAll()
      ads = await storage.readAll()
      assert.equal(ads.length, 0)
      assert.deepEqual(await storage.readAll(), [])
    })
  })
})
