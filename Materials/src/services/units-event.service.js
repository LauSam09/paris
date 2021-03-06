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
    console.error(`Failed to subscribe to topic: ${JSON.stringify(err)}`)
  }
}

const handleMessageValue = async event => {
  try {
    switch (event.mode) {
      case 'create': {
        // Only care about density units
        if (+event.value.type !== 1) {
          console.log('Ignoring non-density unit')
          return
        }

        const sanitisedUnit = {
          _id: event.value._id,
          shortName: event.value.shortName
        }
        console.log('Adding unit')
        await unitsService.add(sanitisedUnit)
      }
        break
      case 'update': {
        if (+event.value.type !== 1) {
          console.log('Ignoring non-density unit')
          return
        }
        const sanitisedUnit = {
          _id: event.value._id,
          unitShortName: event.value.shortName
        }
        console.log('Updating unit')
        await unitsService.update(event.value._id, sanitisedUnit)
        break
      }
      case 'delete': {
        console.log('Removing unit')
        await unitsService.remove(event.value)
        // TODO: Consider behaviour if nested in materials.
        break
      }
      default: 
        console.error(`Unexpected message mode '${event.mode}'`)
    }
  } catch (err) {
    console.error(`Failed to action ${event.mode} event: ${JSON.stringify(event.value)}. Error: ${JSON.stringify(err)}`)
  }
}