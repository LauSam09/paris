import express from 'express'
import * as unitsController from '../controllers/units.controller'

const router = express.Router()

router.get('/', unitsController.getAll)
router.get('/:id', unitsController.get)
router.post('/', unitsController.add)
router.put('/:id', unitsController.update)
router.delete('/:id', unitsController.remove)

export default router