import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'
import { createRouter } from '../lib/hono'
import { minioClient, getBucketName } from '../lib/minio'
import crypto from 'crypto'

const share = createRouter()

share.use('/*', jwt({ secret: process.env.JWT_SECRET! }))

const createShareLinkSchema = z.object({
  fileId: z.string(),
  expiresIn: z.enum(['1h', '1d', '7d', 'never'])
})

share.post('/', zValidator('json', createShareLinkSchema), async c => {
  const { userId } = getCurrentUser(c)
  const { fileId, expiresIn } = c.req.valid('json')

  const file = await prisma.file.findUnique({
    where: { id: fileId }
  })

  if (!file || file.userId !== userId) {
    return c.json({ error: 'File not found' }, 404)
  }

  const token = crypto.randomBytes(32).toString('hex')

  let expiresAt: Date | null = null
  if (expiresIn !== 'never') {
    const now = new Date()
    switch (expiresIn) {
      case '1h':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000)
        break
      case '1d':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        break
      case '7d':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
    }
  }

  const sharedLink = await prisma.sharedLink.create({
    data: {
      token,
      fileId,
      expiresAt
    }
  })

  return c.json({ sharedLink }, 201)
})

share.get('/file/:fileId', async c => {
  const { userId } = getCurrentUser(c)
  const fileId = c.req.param('fileId')

  const file = await prisma.file.findUnique({
    where: { id: fileId }
  })

  if (!file || file.userId !== userId) {
    return c.json({ error: 'File not found' }, 404)
  }

  const links = await prisma.sharedLink.findMany({
    where: { fileId },
    orderBy: { createdAt: 'desc' }
  })

  return c.json({ links })
})

share.delete('/:linkId', async c => {
  const { userId } = getCurrentUser(c)
  const linkId = c.req.param('linkId')

  const link = await prisma.sharedLink.findUnique({
    where: { id: linkId },
    include: { file: true }
  })

  if (!link || link.file.userId !== userId) {
    return c.json({ error: 'Link not found' }, 404)
  }

  await prisma.sharedLink.delete({
    where: { id: linkId }
  })

  return c.json({ message: 'Link revoked' })
})

const sharePublic = new Hono()

sharePublic.get('/:token', async c => {
  const token = c.req.param('token')

  const link = await prisma.sharedLink.findUnique({
    where: { token },
    include: { file: true }
  })

  if (!link) {
    return c.json({ error: 'Link not found' }, 404)
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return c.json({ error: 'Link expired' }, 410)
  }

  await prisma.sharedLink.update({
    where: { id: link.id },
    data: { viewCount: link.viewCount + 1 }
  })

  const url = await minioClient.presignedGetObject(getBucketName(), link.file.key, 60 * 60)

  return c.json({
    file: {
      name: link.file.name,
      size: link.file.size,
      mimeType: link.file.mimeType,
      url
    },
    viewCount: link.viewCount + 1
  })
})

export { share, sharePublic }
