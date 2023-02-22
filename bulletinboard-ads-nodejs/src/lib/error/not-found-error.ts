export default class NotFoundError extends Error {
  code: number
  constructor(message = 'Not Found') {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.code = 404
  }
}
