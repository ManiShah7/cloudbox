import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  MINIO_ENDPOINT: z.string().min(1, 'MINIO_ENDPOINT is required'),
  MINIO_PORT: z.string().default('9000'),
  MINIO_ACCESS_KEY: z.string().min(1, 'MINIO_ACCESS_KEY is required'),
  MINIO_SECRET_KEY: z.string().min(1, 'MINIO_SECRET_KEY is required'),
  MINIO_USE_SSL: z.string().default('false'),
  BUCKET_NAME: z.string().default('cloudbox'),
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  FRONTEND_URL: z.url().default('http://localhost:3001')
})

export type Env = z.infer<typeof envSchema>

export const validateEnv = (): Env => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      throw new Error(`Environment validation failed:\n${messages.join('\n')}`)
    }
    throw error
  }
}
