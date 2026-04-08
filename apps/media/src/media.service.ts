import {Injectable} from '@nestjs/common'

@Injectable()
export class MediaService {
  ping() {
    return {
      ok: true,
      service: 'media',
      time: new Date().toISOString(),
    }
  }
}
