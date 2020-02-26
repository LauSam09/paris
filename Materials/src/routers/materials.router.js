import express from 'express'
import * as materialsController from '../controllers/materials.controller'

const router = express.Router()

router.get('/', materialsController.getAll)
router.get('/:id', materialsController.get)
router.post('/', materialsController.add)
router.put('/:id', materialsController.update)
router.delete('/:id', materialsController.remove)

export default router