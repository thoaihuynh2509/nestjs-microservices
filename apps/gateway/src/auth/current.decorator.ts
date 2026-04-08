import {createParamDecorator, ExecutionContext} from '@nestjs/common'
import {UserContext} from './auth.types'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req: {user?: UserContext} = context.switchToHttp().getRequest()
    return req.user
  }
)
