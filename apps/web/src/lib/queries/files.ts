import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { filesApi } from '@/lib/api/files'
import { toast } from 'sonner'

export const useFiles = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: filesApi.getFiles
  })
}

export const useFolders = () => {
  return useQuery({
    queryKey: ['folders'],
    queryFn: filesApi.getFolders
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
