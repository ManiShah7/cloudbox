import { sign } from 'hono/jwt'
import crypto from 'crypto'

const ACCESS_TOKEN_EXPIRY = 15 * 60 // 15 minutes

export const generateAccessToken = async (userId: string, email: string) => {
  return await sign(
    {
      userId,
      email,
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY
    },
    process.env.JWT_SECRET!
  )
}

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex')
}

export const generateTokenPair = async (userId: string, email: string) => {
  const accessToken = await generateAccessToken(userId, email)
  const refreshToken = generateRefreshToken()
  return { accessToken, refreshToken }
}
