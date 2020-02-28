export class NotFoundError extends Error {
  constructor() {
    super('Not found')
  }

}
export class AlreadyExistsError extends Error {
  constructor() {
    super('Already exists')
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message)
  }
}