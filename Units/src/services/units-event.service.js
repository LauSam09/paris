import { Kafka } from 'kafkajs'

const topic = 'Units'
const kafka = new Kafka({
  clientId: 'default',
  brokers: ['kafka:9092'],
  retry: 10
})
const producer = kafka.producer()

export const publishCreate = async (value) => {
  await publish({
    mode: 'create',
    value
  })
}

export const publishUpdate = async (value) => {
  await publish({
    mode: 'update',
    value
  })
}

export const publishDelete = async (value) => {
  await publish({
    mode: 'delete',
    value
  })
}


const publish = async (value) => {
  try {
    await producer.connect()
    const toSend = {
      topic,
      messages: [{ value: JSON.stringify(value) }]
    }
    console.log(JSON.stringify(toSend))
    const result = await producer.send(toSend)
    console.log(`Sent successfully ${JSON.stringify(result)}`)
    await producer.disconnect()
  } catch (err) {
    console.error(`Failed to send ${JSON.stringify(value)}`)
  }
}