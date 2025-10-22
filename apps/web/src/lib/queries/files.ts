import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { filesApi } from '@/lib/api/files'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth'

export const useFiles = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: ['files'],
    queryFn: filesApi.getFiles,
    enabled: isAuthenticated
  })
}

export const useFolders = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: ['folders'],
    queryFn: filesApi.getFolders,
    enabled: isAuthenticated
  })
}

export const useUploadFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId?: string }) =>
      filesApi.uploadFile(file, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File uploaded successfully!')
    },
    onError: () => {
      toast.error('Failed to upload file')
    }
  })
}

export const useAnalyzeFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => filesApi.analyzeFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('AI analysis complete!')
    },
    onError: () => {
      toast.error('Failed to analyze file')
    }
  })
}

export const useDeleteFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => filesApi.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete file')
    }
  })
}

export const useTogglePublic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => filesApi.togglePublic(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File visibility updated!')
    }
  })
}
