import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const SignUpResultSchema = z.object({
  success: z.boolean(),
})

export type SignUpResultDto = z.infer<typeof SignUpResultSchema>
