export default class ReviewsClient {
  #fetch = null
  #endpoint = null
  #log = null

  constructor (fetch, endpoint, logger) {
    this.#fetch = fetch
    this.#endpoint = endpoint
    this.#log = logger.child({ module: 'reviews-client' })
  }

  getEndpoint () {
    return this.#endpoint
  }

  async getAverageRating (contact) {
    this.#log.debug('Getting average rating for contact: %s', contact)
    const response = await this.#fetch(`${this.#endpoint}/api/v1/averageRatings/${contact}`)
    const { averageRating } = await response.json()
    this.#log.debug('Successfully got average rating for contact: %s - %d', contact, averageRating)
    return averageRating
  }
}
