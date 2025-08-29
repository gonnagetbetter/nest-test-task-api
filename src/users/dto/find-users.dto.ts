import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ApiProperty } from '@nestjs/swagger'

export const FindUsersSchema = z.object({
  name: z.string().optional().describe('Filter users by name'),
  blocked: z.preprocess(val => val === 'true', z.boolean().optional()).describe('Filter users by blocked status'),
})

// Create a class for Swagger documentation
export class FindUsersDto extends createZodDto(FindUsersSchema) {
  @ApiProperty({ description: 'Filter users by name', required: false, example: 'John' })
  name?: string;

  @ApiProperty({ description: 'Filter users by blocked status', required: false, example: true })
  blocked?: boolean;
}
