import { MongoClient } from 'mongodb'
import { AlreadyExistsError, NotFoundError } from '../models/error'
import uuid from 'uuid/v4'

// Connection URL
const url = 'mongodb://mongo:27017'

// Database
const dbName = 'units'
const collectionName = 'units'

const getClient = () => {
  return new MongoClient(url, {
    auth: { user: 'root', password: 'example' }
  })
}

export const getAll = async ()=> {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  const result = await db
    .collection(collectionName)
    .find({})
    .toArray()
  await connected.close()
  return result
}

export const get = async (id) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  const result = await db
    .collection(collectionName)
    .findOne({ _id: id })

  await connected.close()

  if (result) {
    return result
  } else {
    throw new NotFoundError()
  }
}

export const add = async (unit) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  if (
    await db
      .collection(collectionName)
      .findOne({ name: unit.name })
  ) {
    throw new AlreadyExistsError()
  }

  unit._id = uuid()

  const result = await db.collection(collectionName).insertOne(unit)
  await connected.close()

  if (!result.result.ok || result.insertedCount !== 1) {
    throw new Error('Could not create material for unknown reason')
  }

  return result.ops[0]
}

export const update = async (id, unit) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  unit._id = id

  if (!await db.collection(collectionName).findOne({ _id: id })) {
    throw new NotFoundError()
  }

  const result = await db.collection(collectionName).findOneAndUpdate(
    { _id: id }, 
    { $set: unit }, 
    { returnOriginal: false })

    connected.close()

  if (!result.ok || !result.value) {
    throw new Error('Could not update material for unknown reason')
  }

  return result.value
}

export const remove = async (id) => {

  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  if (!await db.collection(collectionName).findOne({ _id: id })) {
    throw new NotFoundError()
  }

  const result = await db.collection(collectionName).deleteOne({ _id: id })
  connected.close()

  if (!result.result.ok) {
    throw new Error('Could not delete unit for unknown reason')
  }
}