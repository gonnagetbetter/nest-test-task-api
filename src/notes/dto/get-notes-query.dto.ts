import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ApiProperty } from '@nestjs/swagger'

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().describe('Page number'),
  limit: z.coerce.number().int().min(1).max(100).optional().describe('Items per page'),
  order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
})

// Create a class for Swagger documentation
export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {
  @ApiProperty({ description: 'Page number', required: false, example: 1, minimum: 1 })
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false, example: 10, minimum: 1, maximum: 100 })
  limit?: number;

  @ApiProperty({ description: 'Sort order', required: false, enum: ['asc', 'desc'], example: 'desc' })
  order?: 'asc' | 'desc';
}
