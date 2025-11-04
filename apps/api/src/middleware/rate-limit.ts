import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

type RateLimitStore = {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitStore>()

type RateLimitOptions = {
  windowMs: number
  max: number
  message?: string
}

export const rateLimit = (options: RateLimitOptions) => {
  const { windowMs, max, message = 'Too many requests' } = options

  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    const key = `${ip}:${c.req.path}`
    const now = Date.now()

    let record = store.get(key)

    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs
      }
      store.set(key, record)
    }

    record.count++

    if (record.count > max) {
      throw new HTTPException(429, { message })
    }

    await next()
  }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key)
    }
  }
}, 60000)
