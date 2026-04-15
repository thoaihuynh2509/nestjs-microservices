import {Controller, Get} from '@nestjs/common'
import {CurrentUser} from './current.decorator'
import type {UserContext} from './auth.types'

@Controller('auth')
export class AuthController {
  @Get('me')
  me(@CurrentUser() user: UserContext) {
    return {user}
  }
}
