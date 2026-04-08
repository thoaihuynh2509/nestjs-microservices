import {NestFactory} from '@nestjs/core'
import {Logger} from '@nestjs/common'
import {MicroserviceOptions, Transport} from '@nestjs/microservices'
import {SearchModule} from './search.module'

async function bootstrap() {
  process.title = 'search'

  const logger = new Logger('SearchBootstrap')
  const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  const searchQueue = process.env.SEARCH_QUEUE || 'search_queue'

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: searchQueue,
        queueOptions: {
          durable: false,
        },
      },
    }
  )
  app.enableShutdownHooks()

  await app.listen()

  logger.log(
    `Search microservice (RMQ) is running on queue ${searchQueue} via ${rabbitMqUrl}`
  )
}
bootstrap()
