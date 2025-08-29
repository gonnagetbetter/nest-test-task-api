import { z } from 'zod'
export const SignUpResultSchema = z.object({
  success: z.boolean(),
})

export type SignUpResultDto = z.infer<typeof SignUpResultSchema>
