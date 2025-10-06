import type { Context } from 'hono'
import type { Env } from '../types'

export const getCurrentUser = (c: Context<Env>) => {
  return c.get('jwtPayload')
}
