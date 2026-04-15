import {
  INestApplication,
  INestMicroservice,
  ValidationPipe,
} from '@nestjs/common'
import {RpcExceptionFilter} from './rpc-exception.filter'
import {RpcToHttpExceptionFilter} from './http/rpc-to-http-exception.filter'

export function applyToMicroservice(app: INestMicroservice): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.useGlobalFilters(new RpcExceptionFilter())
}

export function applyToHttpApp(app: INestApplication): void {
  app.useGlobalFilters(new RpcToHttpExceptionFilter())
}
