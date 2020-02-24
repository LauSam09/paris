import express from 'express'
import unitsRouter from './units.router'

const router = express.Router()

router.use('/units', unitsRouter)

export default router