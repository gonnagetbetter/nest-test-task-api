import { UserRole } from '../../users/enum/user-role.enum'

export type UserMetadata = {
  userId: number
  userEmail: string
  userRole: UserRole
}
