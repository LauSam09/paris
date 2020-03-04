import express from 'express'
import bodyParser from 'body-parser'
import router from './routers'
import { subscribe } from './services/units-event.service'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', router)

// TODO: make env variable.
subscribe('kafka:9092').then(() => app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
}))
