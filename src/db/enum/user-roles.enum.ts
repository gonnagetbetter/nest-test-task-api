import { pgEnum } from 'drizzle-orm/pg-core'
import { UserRole } from '../../users/enum/user-role.enum'

export const roleEnum = pgEnum(
  'role',
  Object.values(UserRole) as [string, ...string[]],
)
