import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { createRouter } from '../lib/hono'
import { generateTokenPair } from '../lib/token'
import { getCookie, setCookie } from 'hono/cookie'
import { loginSchema, registerSchema } from 'shared/schemas'

const auth = createRouter()

auth.post('/register', zValidator('json', registerSchema), async c => {
  const { email, password, name } = c.req.valid('json')

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return c.json({ message: 'User already exists' }, 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { refreshToken } = await generateTokenPair('temp', email)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, refreshToken }
  })

  const finalAccessToken = await generateTokenPair(user.id, user.email).then(
    tokens => tokens.accessToken
  )

  // Set HttpOnly cookie for refresh token
  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  })

  return c.json(
    {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: finalAccessToken
    },
    201
  )
})

auth.post('/login', zValidator('json', loginSchema), async c => {
  const { email, password } = c.req.valid('json')

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return c.json({ message: 'Invalid email or password' }, 401)
  }

  const passwordMatch = await bcrypt.compare(password, user.password!)

  if (!passwordMatch) {
    return c.json({ message: 'Invalid email or password' }, 401)
  }

  const { accessToken, refreshToken } = await generateTokenPair(user.id, user.email)

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  })

  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  })

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    accessToken
  })
})

auth.post('/refresh', async c => {
  const refreshToken = getCookie(c, 'refreshToken')

  if (!refreshToken) {
    return c.json({ message: 'No refresh token provided' }, 401)
  }

  const user = await prisma.user.findFirst({
    where: { refreshToken }
  })

  if (!user) {
    return c.json({ message: 'Invalid refresh token' }, 401)
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokenPair(
    user.id,
    user.email
  )

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken }
  })

  setCookie(c, 'refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  })

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    accessToken
  })
})

auth.post('/logout', async c => {
  const refreshToken = getCookie(c, 'refreshToken')

  if (refreshToken) {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null }
    })
  }

  setCookie(c, 'refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 0,
    path: '/'
  })

  return c.json({ message: 'Logged out successfully' })
})

export default auth
