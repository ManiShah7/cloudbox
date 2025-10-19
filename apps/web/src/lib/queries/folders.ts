import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { foldersApi } from '../api/folders'
import { toast } from 'sonner'
import { filesApi } from '../api/files'
import { useAuthStore } from '../store/auth'

export const useFolders = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: ['folders'],
    queryFn: filesApi.getFolders,
    enabled: isAuthenticated
  })
}

export const useCreateFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; parentId?: string }) => foldersApi.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast.success('Folder created successfully!')
    },
    onError: () => {
      toast.error('Failed to create folder')
    }
  })
}

export const useDeleteFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) => foldersApi.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('Folder deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete folder')
    }
  })
}
