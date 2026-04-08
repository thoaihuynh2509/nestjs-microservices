import {Controller, Get, Inject} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {firstValueFrom} from 'rxjs'

interface PingResponse {
  ok: boolean
  service: string
  time: string
}

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_SERVICE') private readonly mediaClient: ClientProxy,
    @Inject('SEARCH_SERVICE') private readonly searchClient: ClientProxy
  ) {}

  @Get('health')
  async health() {
    const ping = async (serviceName: string, client: ClientProxy) => {
      try {
        const result = await firstValueFrom(
          client.send<PingResponse>('service.ping', {from: 'gateway'})
        )
        return {
          ok: true,
          service: serviceName,
          result,
        }
      } catch (error: unknown) {
        return {
          ok: false,
          service: serviceName,
          error: (error as Error)?.message || 'Unknown error',
        }
      }
    }

    const [catalog, media, search] = await Promise.all([
      ping('catalog', this.catalogClient),
      ping('media', this.mediaClient),
      ping('search', this.searchClient),
    ])

    const ok = catalog.ok && media.ok && search.ok

    return {
      ok,
      gateway: {service: 'gateway', time: new Date().toISOString()},
      services: {
        catalog,
        media,
        search,
      },
    }
  }
}
