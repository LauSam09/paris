import express from 'express'

const router = express.Router()

router.get('/', unitsController.getAll)
router.get('/:id', unitsController.get)
router.post('/', unitsController.add)
router.put('/:id', unitsController.update)
router.delete('/:id', unitsController.delete)

export default router