import { apiClient } from './client'
import type { CreateShareLinkInput, SharedLink, ShareLinksResponse } from 'shared/schemas'

export const shareApi = {
  createLink: async (data: CreateShareLinkInput) => {
    const { data: response } = await apiClient.post<{ sharedLink: SharedLink }>('/share', data)
    return response.sharedLink
  },

  getFileLinks: async (fileId: string) => {
    const { data } = await apiClient.get<ShareLinksResponse>(`/share/file/${fileId}`)
    return data.links
  },

  revokeLink: async (linkId: string) => {
    await apiClient.delete(`/share/${linkId}`)
  }
}
