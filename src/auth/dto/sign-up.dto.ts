import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { SignInSchema } from './sign-in.dto'

export const SignUpSchema = SignInSchema.extend({
  fullName: z.string().nonempty(),
})

export type SignUpDto = z.infer<typeof SignUpSchema>
