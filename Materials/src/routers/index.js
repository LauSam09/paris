import express from 'express'
import materialsRouter from './materials.router'
import errorMiddleware from '../middleware/error'

const router = express.Router()

router.use('/materials', materialsRouter)
router.use(errorMiddleware)

export default router