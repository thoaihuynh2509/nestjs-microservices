import {NestFactory} from '@nestjs/core'
import {GatewayModule} from './gateway.module'
import {Logger} from '@nestjs/common'
import {applyToHttpApp} from '@app/rpc'

async function bootstrap() {
  process.title = 'gateway'

  const logger = new Logger('GatewayBootstrap')
  const app = await NestFactory.create(GatewayModule)
  app.enableShutdownHooks()

  applyToHttpApp(app)

  const port = process.env.GATEWAY_PORT ?? 4000
  await app.listen(port)

  logger.log(`Gateway is running on port ${port}`)
}
void bootstrap().catch((error: unknown) => {
  const logger = new Logger('GatewayBootstrap')
  logger.error('Failed to bootstrap gateway', error)
  process.exitCode = 1
})
