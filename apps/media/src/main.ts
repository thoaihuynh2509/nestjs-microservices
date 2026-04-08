import {NestFactory} from '@nestjs/core'
import {Logger} from '@nestjs/common'
import {MicroserviceOptions, Transport} from '@nestjs/microservices'
import {MediaModule} from './media.module'

async function bootstrap() {
  process.title = 'media'

  const logger = new Logger('MediaBootstrap')
  const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  const mediaQueue = process.env.MEDIA_QUEUE || 'media_queue'

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: mediaQueue,
        queueOptions: {
          durable: false,
        },
      },
    }
  )
  app.enableShutdownHooks()

  await app.listen()

  logger.log(
    `Media microservice (RMQ) is running on queue ${mediaQueue} via ${rabbitMqUrl}`
  )
}
bootstrap()
