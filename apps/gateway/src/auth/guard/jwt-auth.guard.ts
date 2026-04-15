import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {AuthService} from '../auth.service'
import {UserService} from '../../users/user.service'
import {IS_PUBLIC_KEY} from '../public.decorator'
import {Request} from 'express'
import {UserContext} from '../auth.types'
import {REQUIRED_ROLE_KEY} from '../admin.decorator'

interface AuthenticatedRequest extends Request {
  user: UserContext
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (isPublic) {
      return true
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

    const authHeader = req.headers['authorization']
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException('Missing or invalid Authorization header')
    }

    // Extract the token from the Authorization header
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : ''
    if (!token) {
      throw new UnauthorizedException('Missing or invalid token')
    }

    try {
      const identifyAuthUser =
        await this.authService.verifyTokenAndBuildContext(token)
      // Upsert the user in the database and attach the user context to the request object
      const dbUser = await this.userService.upsertAuthUser({
        clerkUserId: identifyAuthUser.clerkUserId,
        email: identifyAuthUser.email,
        name: identifyAuthUser.name,
      })
      const user: UserContext = {
        ...identifyAuthUser,
        role: dbUser.role,
      }

      // Attach the user context to the request object for later use in controllers
      req.user = user

      const requiredRole = this.reflector.getAllAndOverride<string>(
        REQUIRED_ROLE_KEY,
        [context.getHandler(), context.getClass()]
      )

      if (requiredRole === 'admin' && user.role !== 'admin') {
        throw new UnauthorizedException(
          'Insufficient permissions: admin role required'
        )
      }
      return true
    } catch (error) {
      console.error('Error verifying token:', error)
      throw new UnauthorizedException('Invalid token')
    }
  }
}
