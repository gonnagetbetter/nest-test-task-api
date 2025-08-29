import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ApiProperty } from '@nestjs/swagger'

export const UpdateUserSchema = z.object({
  fullName: z.string().optional().describe('User full name'),
  email: z.string().optional().describe('User email address'),
})

// Create a class for Swagger documentation
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {
  @ApiProperty({ description: 'User full name', required: false, example: 'John Doe' })
  fullName?: string;

  @ApiProperty({ description: 'User email address', required: false, example: 'john.doe@example.com' })
  email?: string;
}
