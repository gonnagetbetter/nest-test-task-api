import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const SignInSchema = z.object({
  email: z.email().nonempty({ message: 'Email is required' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .max(20, { message: 'Password must be less than 20 characters' })
    .min(8, { message: 'Password must be more than 8 characters' }),
})

export type SignInDto = z.infer<typeof SignInSchema>
