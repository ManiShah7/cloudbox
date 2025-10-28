import { z } from 'zod'

export const createShareLinkSchema = z.object({
  fileId: z.string(),
  expiresIn: z.enum(['1h', '1d', '7d', 'never'])
})

export const sharedLinkSchema = z.object({
  id: z.string(),
  token: z.string(),
  fileId: z.string(),
  expiresAt: z.string().datetime().nullable(),
  viewCount: z.number(),
  createdAt: z.string().datetime()
})

export const shareLinksResponseSchema = z.object({
  links: z.array(sharedLinkSchema)
})

export const publicFileResponseSchema = z.object({
  file: z.object({
    name: z.string(),
    size: z.number(),
    mimeType: z.string(),
    url: z.string()
  }),
  viewCount: z.number()
})

export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>
export type SharedLink = z.infer<typeof sharedLinkSchema>
export type ShareLinksResponse = z.infer<typeof shareLinksResponseSchema>
export type PublicFileResponse = z.infer<typeof publicFileResponseSchema>
