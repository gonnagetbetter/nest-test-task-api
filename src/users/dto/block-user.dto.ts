import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ApiProperty } from '@nestjs/swagger'

export const BlockUserSchema = z.object({
  isBlocked: z.boolean().describe('Whether the user is blocked'),
})

// Create a class for Swagger documentation
export class BlockUserDto extends createZodDto(BlockUserSchema) {
  @ApiProperty({ description: 'Whether the user is blocked', example: true })
  isBlocked: boolean;
}
