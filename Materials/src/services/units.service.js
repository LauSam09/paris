import { MongoClient } from 'mongodb'
import { NotFoundError } from '../models/error'

// Connection URL - swap for 'materials-db' when using docker-compose
const host = process.env.NODE_ENV === 'production'
  ? 'materials-db'
  : 'localhost'
const url = `mongodb://${host}:27017`

console.log('db connection string: ' + url)

// Database
const dbName = 'materials'
const unitsCollection = 'units'

const getClient = () => {
  return new MongoClient(url, {
    auth: { user: 'root', password: 'example' }
  })
}

export const add = async (unit) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  const result = await db.collection(unitsCollection).insertOne(unit)
  await connected.close()

  if (!result.result.ok || result.insertedCount !== 1) {
    throw new Error('Could not create unit for unknown reason')
  }

  return result.ops[0]
}

export const update = async (id, unit) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  unit._id = id

  if (!await db.collection(unitsCollection).findOne({ _id: id })) {
    throw new NotFoundError()
  }

  const result = await db.collection(unitsCollection).findOneAndUpdate(
    { _id: id }, 
    { $set: unit }, 
    { returnOriginal: false })

    connected.close()

  if (!result.ok || !result.value) {
    throw new Error('Could not update unit for unknown reason')
  }

  return result.value
}

export const remove = async (id) => {

  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  if (!await db.collection(unitsCollection).findOne({ _id: id })) {
    throw new NotFoundError()
  }

  const result = await db.collection(unitsCollection).deleteOne({ _id: id })
  connected.close()

  if (!result.result.ok) {
    throw new Error('Could not delete unit for unknown reason')
  }
}