import {Module} from '@nestjs/common'
import {GatewayController} from './gateway.controller'
import {GatewayService} from './gateway.service'
import {ClientsModule, Transport} from '@nestjs/microservices'

const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672'
const catalogQueue = process.env.CATALOG_QUEUE || 'catalog_queue'
const mediaQueue = process.env.MEDIA_QUEUE || 'media_queue'
const searchQueue = process.env.SEARCH_QUEUE || 'search_queue'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitUrl],
          queue: catalogQueue,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'SEARCH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitUrl],
          queue: searchQueue,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MEDIA_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitUrl],
          queue: mediaQueue,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
