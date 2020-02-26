import express from 'express'
import unitsRouter from './units.router'
import errorMiddleware from '../middleware/error'

const router = express.Router()

router.use('/units', unitsRouter)
router.use(errorMiddleware)

export default router