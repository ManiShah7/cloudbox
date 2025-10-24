import { z } from 'zod'

export const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  mimeType: z.string(),
  key: z.string(),
  url: z.string(),
  isPublic: z.boolean(),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  aiAnalyzed: z.boolean(),
  description: z.string().nullable(),
  userId: z.string(),
  folderId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  parentId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const fileListResponseSchema = z.object({
  files: z.array(fileSchema)
})

export const folderListResponseSchema = z.object({
  folders: z.array(folderSchema)
})

export const fileAnalysisResponseSchema = z.object({
  file: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string().nullable(),
    tags: z.array(z.string()),
    aiAnalyzed: z.boolean()
  }),
  suggestedName: z.string().optional()
})

export const storageStatsSchema = z.object({
  totalSize: z.number(),
  totalFiles: z.number(),
  categoryStats: z.record(z.string(), z.number()),
  aiAnalyzedPercentage: z.number(),
  recentUploads: z.number(),
  storageByCategory: z.record(z.string(), z.number())
})

export type FileRecord = z.infer<typeof fileSchema>
export type Folder = z.infer<typeof folderSchema>
export type FileListResponse = z.infer<typeof fileListResponseSchema>
export type FolderListResponse = z.infer<typeof folderListResponseSchema>
export type StorageStats = z.infer<typeof storageStatsSchema>
export type FileAnalysisResponse = z.infer<typeof fileAnalysisResponseSchema>
