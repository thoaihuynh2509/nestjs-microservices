import {Injectable, UnauthorizedException} from '@nestjs/common'
import {createClerkClient, verifyToken} from '@clerk/backend'
import {UserContext} from './auth.types'

interface VerifiedToken {
  payload?: Record<string, any>
  claims?: Record<string, any>
}

@Injectable()
export class AuthService {
  private readonly clerkInstance = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  })

  async verifyTokenAndBuildContext(token: string): Promise<UserContext> {
    try {
      const verified: VerifiedToken = (await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      })) as VerifiedToken

      // decoded payload
      const payload: Record<string, any> =
        verified?.payload ?? verified?.claims ?? verified

      const clerkUserId: string = (payload?.sub ??
        payload?.userId ??
        payload?.user_id ??
        '') as string

      if (!clerkUserId) {
        throw new UnauthorizedException('Invalid token: missing user ID')
      }
      const role: UserContext['role'] = 'user' // Default role, you can enhance this logic to determine the role based on your application's needs
      const emailFromToken = payload?.email as string | undefined
      const nameFromToken = payload?.name as string | undefined

      if (emailFromToken && nameFromToken) {
        return {
          clerkUserId,
          email: emailFromToken,
          name: nameFromToken,
          role,
        }
      }

      const user = await this.clerkInstance.users.getUser(clerkUserId)
      const primaryEmail =
        user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress ?? user.emailAddresses[0]?.emailAddress
      const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.username ||
        'Unknown User'

      return {
        clerkUserId,
        email: emailFromToken || primaryEmail,
        name: nameFromToken || fullName,
        role,
      }
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
