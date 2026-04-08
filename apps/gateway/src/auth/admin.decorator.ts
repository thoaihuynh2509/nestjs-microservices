import {SetMetadata} from '@nestjs/common'

export const REQUIRED_ROLE_KEY = 'requiredRole'

export const AdminOnly = () => {
  return () => {
    SetMetadata(REQUIRED_ROLE_KEY, 'admin')
  }
}
