import express from 'express'
import bodyParser from 'body-parser'
import router from './routers'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', router)

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})