import './config/env.js'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import routes from './routes'
import { ensureBucketExists } from './lib/minio'
import { validateEnv } from './lib/env'

const app = new Hono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600
  })
)

app.route('/api', routes)

app.get('/health', c => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

app.notFound(c => {
  return c.json({ error: 'Not Found' }, 404)
})

app.onError((err, c) => {
  console.error('Server error:', err)

  if (err.message.includes('JWT')) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  return c.json(
    {
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    },
    500
  )
})

const port = 3000

const startServer = async () => {
  try {
    validateEnv()
    await ensureBucketExists()

    serve(
      {
        fetch: app.fetch,
        port
      },
      info => {
        console.log(`Server is running on http://localhost:${info.port}`)
      }
    )
  } catch (error) {
    console.error('Server startup failed:', (error as Error).message)
    process.exit(1)
  }
}

startServer()
