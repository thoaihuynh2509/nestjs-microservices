import {Module} from '@nestjs/common'
import {GatewayController} from './gateway.controller'
import {GatewayService} from './gateway.service'
import {ClientsModule, Transport} from '@nestjs/microservices'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {MongooseModule} from '@nestjs/mongoose'
import {AuthModule} from './auth/auth.module'
import {UserModule} from './users/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI_USERS') ||
          'mongodb://localhost:27017/ecom_user_db',
      }),
    }),

    AuthModule,
    UserModule,

    ClientsModule.registerAsync([
      {
        name: 'CATALOG_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://localhost:5672',
            ],
            queue:
              configService.get<string>('CATALOG_QUEUE') || 'catalog_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'SEARCH_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://localhost:5672',
            ],
            queue: configService.get<string>('SEARCH_QUEUE') || 'search_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'MEDIA_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://localhost:5672',
            ],
            queue: configService.get<string>('MEDIA_QUEUE') || 'media_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
