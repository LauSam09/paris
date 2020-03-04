import { Kafka } from 'kafkajs'
import * as unitsService from './units.service'
const topic = 'Units'

export const subscribe = async (server) => {
  console.log('subscribe:')

  const kafka = new Kafka({
    clientId: 'default',
    brokers: [server],
    retry: 10
  })
  
  // Want each service to be in a unique kafka group.
  const consumer = kafka.consumer({ groupId: 'Materials'})

  try {
    await consumer.connect()
    console.log('Connected')
  } catch (err) {
    console.error(`Failed to connect to kafka server: ${JSON.stringify(err)}`)
    return
  }

  try {
    consumer.subscribe({
      topic,
      fromBeginning: true
    })
    console.log(`Subscribed to ${topic}`)

    await consumer.run({
      eachMessage: async result => {
        console.log('Received message')
        await handleMessageValue(JSON.parse(result.message.value))
      }
    })

  } catch (err) {
    console.log('err')
    console.error(`Failed to subscribe to topic: ${JSON.stringify(err)}`)
  }

  console.log('exiting subscribe')
}

const handleMessageValue = async event => {
  try {
    switch (event.mode) {
      case 'create': {
        const sanitisedUnit = {
          _id: event.value._id,
          shortName: event.value.shortName,
          name: event.value.name
        }
        console.log(`Adding unit ${JSON.stringify(sanitisedUnit)}`)
        await unitsService.add(sanitisedUnit)
      }
        break
      case 'update': {
        const sanitisedUnit = {
          shortName: event.value.shortName,
          name: event.value.name
        }
        
        await unitsService.update(event.value._id, sanitisedUnit)
        // TODO: Go through and update nested units in materials collection
        break
      }
      case 'delete': {
        await unitsService.remove(event.value)
        // TODO: Consider behaviour if nested in materials.
        break
      }
      default: 
        console.error(`Unexpected message mode '${event.mode}'`)
    }
  } catch (err) {
    console.error(`Failed to action ${event.mode} event: ${JSON.stringify(event.value)}`)
  }
}