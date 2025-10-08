import type { User as PrismaUser } from '@prisma/client'

export type { User, File, Folder, Account, Session } from '@prisma/client'

export type AuthResponse = {
  user: PrismaUser
  accessToken: string
}
