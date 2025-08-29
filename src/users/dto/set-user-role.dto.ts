import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../enum/user-role.enum'

export const SetUserRoleSchema = z.object({
  role: z.enum(UserRole).describe('User role'),
})

// Create a class for Swagger documentation
export class SetUserRoleDto extends createZodDto(SetUserRoleSchema) {
  @ApiProperty({ 
    description: 'User role', 
    enum: UserRole,
    example: UserRole.USER
  })
  role: UserRole;
}
