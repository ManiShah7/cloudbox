import { Hono } from 'hono'
import type { Env } from '../types'

export const createRouter = () => new Hono<Env>()
