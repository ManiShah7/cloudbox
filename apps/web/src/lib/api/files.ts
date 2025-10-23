import { apiClient } from './client'
import type { FileFilters, FileRecord, Folder } from 'shared/types'

type FileListResponse = {
  files: FileRecord[]
}

type FolderListResponse = {
  folders: Folder[]
}

export const filesApi = {
  getFiles: async (params?: FileFilters) => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.category) queryParams.append('category', params.category)

    const queryString = queryParams.toString()
    const url = queryString ? `/files?${queryString}` : '/files'

    const { data } = await apiClient.get<FileListResponse>(url)
    return data.files
  },

  getFolders: async () => {
    const { data } = await apiClient.get<FolderListResponse>('/folders')
    return data.folders
  },

  uploadFile: async (file: File, folderId?: string) => {
    const formData = new FormData()
    formData.append('file', file)

    if (folderId) {
      formData.append('folderId', folderId)
    }

    const { data } = await apiClient.post<FileRecord>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  },

  analyzeFile: async (fileId: string) => {
    const { data } = await apiClient.post<{
      file: FileRecord
      suggestedName?: string
    }>(`/files/${fileId}/analyze`)
    return data
  },

  deleteFile: async (fileId: string) => {
    await apiClient.delete(`/files/${fileId}`)
  },

  togglePublic: async (fileId: string) => {
    const { data } = await apiClient.patch<{ file: FileRecord }>(`/files/${fileId}/toggle-public`)
    return data.file
  }
}
