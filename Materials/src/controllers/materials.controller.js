import * as materialsService from '../services/materials.service'

export const getAll = async (_, res, next) => {
  try {
    const materials = await materialsService.getAll()
    res.json(materials)
  } catch (error) {
    return next(error)
  }
  next()
}

export const get = async (req, res, next) => {
  try {
    const { id } = req.params
    const material = await materialsService.get(id)
    res.json(material)
  } catch (error) {
    return next(error)
  }
  next()
}

export const add = async (req, res, next) => {
  try {
    const material = req.body
    const created = await materialsService.add(material)
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
    const material = req.body
    const updated = await materialsService.update(id, material)
    res.json(updated)
  } catch (error) {
    return next(error)
  }
  next()
}

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params
    await materialsService.remove(id)
    res.status(204)
    res.json({})
  } catch (error) {
    return next(error)
  }
  next()
}