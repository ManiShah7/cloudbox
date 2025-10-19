import { apiClient } from './client'
import type { Folder } from 'shared/types'

type CreateFolderData = {
  name: string
  parentId?: string
}

export const foldersApi = {
  createFolder: async (data: CreateFolderData) => {
    const { data: response } = await apiClient.post<{ folder: Folder }>('/folders', data)
    return response.folder
  },

  deleteFolder: async (folderId: string) => {
    await apiClient.delete(`/folders/${folderId}`)
  }
}
