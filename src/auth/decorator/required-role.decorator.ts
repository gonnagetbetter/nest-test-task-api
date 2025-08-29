import { UserRole } from '../../users/enum/user-role.enum'
import { SetMetadata } from '@nestjs/common'

export function RequiredRole(role: UserRole) {
  return SetMetadata('requiredRole', role)
}
