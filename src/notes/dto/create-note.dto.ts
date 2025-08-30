import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ApiProperty } from '@nestjs/swagger'

export const CreateNoteSchema = z.object({
  title: z.string().nonempty().describe('Note title'),
  text: z.string().nonempty().describe('Note content'),
})

// Create a class for Swagger documentation
export class CreateNoteDto extends createZodDto(CreateNoteSchema) {
  @ApiProperty({ description: 'Note title', example: 'My first note' })
  title: string;

  @ApiProperty({ description: 'Note content', example: 'This is the content of my first note' })
  text: string;
}
