import unitsService from '../services/units-service'

export const getAll = async (_, res, next) => {
  try {
    const units = await unitsService.getAll()
    res.json(units)
  } catch (error) {
    return next(error)
  }
  next()
}

export const get = async (req, res, next) => {
  try {
    const { id } = req.params
    const unit = await unitsService.get(id)
    res.json(unit)
  } catch (error) {
    return next(error)
  }
  next()
}

export const add = async (req, res, next) => {
  try {
    const unit = req.body
    const created = await unitsService.add(unit)
    res.status(201)
    res.json(created)
  } catch (error) {
    return next(error)
  }
  next()
}

export const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const unit = req.body
    const updated = await unitsService.update(id, unit)
    res.json(updated)
  } catch (error) {
    return next(error)
  }
  next()
}

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params
    await unitsService.remove(id)
    res.status(204)
    res.json({})
  } catch (error) {
    return next(error)
  }
  next()
}