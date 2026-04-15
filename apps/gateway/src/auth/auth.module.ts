import {Module} from '@nestjs/common'
import {UserModule} from '../users/user.module'
import {AuthService} from './auth.service'
import {APP_GUARD} from '@nestjs/core'
import {JwtAuthGuard} from './guard/jwt-auth.guard'
import {AuthController} from './auth.controller'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
