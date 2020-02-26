import { NotFoundError, AlreadyExistsError } from '../models/error'

const errorMiddleware = (requestError, _, res, next) => {

  if (requestError instanceof NotFoundError) {
    res.status(404).send()
    return next()
  }

  if (requestError instanceof AlreadyExistsError) {
    res.status(400).send('A material with this name already exists.')
    return next()
  }

  res.status(500).send('Something went wrong!')
  return next()
}

export default errorMiddleware