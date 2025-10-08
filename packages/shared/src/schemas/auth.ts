import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string()
})

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2)
})

export type LoginCredentials = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
