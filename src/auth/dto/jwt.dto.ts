import { z } from 'zod'

export const JwtSchema = z.object({
  accessToken: z.string(),
})

export type JwtDto = z.infer<typeof JwtSchema>
