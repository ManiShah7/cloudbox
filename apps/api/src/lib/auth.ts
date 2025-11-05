import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env } from '../types'

export const getCurrentUser = (c: Context<Env>) => {
  const payload = c.get('jwtPayload')

  if (!payload || !payload.userId) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  return { userId: payload.userId as string }
}
