import { MongoClient } from 'mongodb'
import { AlreadyExistsError, NotFoundError } from '../models/error'
import uuid from 'uuid/v4'

// Connection URL - swap for 'mongo' when using docker-compose
const host = process.env.NODE_ENV === 'production'
  ? 'mongo'
  : 'localhost'
const url = `mongodb://${host}:27017`

console.log('db connection string: ' + url)

// Database
const dbName = 'materials'
const collectionName = 'materials'

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

export const add = async (material) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  if (
    await db
      .collection(collectionName)
      .findOne({ name: material.name })
  ) {
    throw new AlreadyExistsError()
  }

  material._id = uuid()

  const result = await db.collection(collectionName).insertOne(material)
  await connected.close()

  if (!result.result.ok || result.insertedCount !== 1) {
    throw new Error('Could not create material for unknown reason')
  }

  return result.ops[0]
}

export const update = async (id, material) => {
  const client = getClient()
  const connected = await client.connect()
  const db = client.db(dbName)

  material._id = id

  if (!await db.collection(collectionName).findOne({ _id: id })) {
    throw new NotFoundError()
  }

  const result = await db.collection(collectionName).findOneAndUpdate(
    { _id: id }, 
    { $set: material }, 
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
    throw new Error('Could not delete material for unknown reason')
  }
}