import { jwt } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'
import { createRouter } from '../lib/hono'

const folders = createRouter()

folders.use('/*', jwt({ secret: process.env.JWT_SECRET! }))

folders.get('/', async c => {
  try {
    const { userId } = getCurrentUser(c)

    const folders = await prisma.folder.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return c.json({ folders })
  } catch (error) {
    console.error('Get folders error:', error)
    return c.json({ message: 'Failed to get folders' }, 500)
  }
})

// Create folder
const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  parentId: z.string().optional()
})

folders.post('/', zValidator('json', createFolderSchema), async c => {
  try {
    const { userId } = getCurrentUser(c)
    const body = await c.req.json()
    const { name, parentId } = body

    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
        parentId: parentId || null
      }
    })

    return c.json({ folder }, 201)
  } catch (error) {
    console.error('Create folder error:', error)
    return c.json({ message: 'Failed to create folder' }, 500)
  }
})

folders.delete('/:id', async c => {
  try {
    const { userId } = getCurrentUser(c)
    const folderId = c.req.param('id')

    const folder = await prisma.folder.findUnique({
      where: { id: folderId }
    })

    if (!folder || folder.userId !== userId) {
      return c.json({ message: 'Folder not found' }, 404)
    }

    await prisma.folder.delete({
      where: { id: folderId }
    })

    return c.json({ message: 'Folder deleted' })
  } catch (error) {
    console.error('Delete folder error:', error)
    return c.json({ message: 'Failed to delete folder' }, 500)
  }
})

export default folders
