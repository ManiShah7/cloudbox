import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shareApi } from '@/lib/api/share'
import { toast } from 'sonner'

export const useFileLinks = (fileId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['share-links', fileId],
    queryFn: () => shareApi.getFileLinks(fileId),
    enabled: !!fileId && enabled,
    refetchOnWindowFocus: true
  })
}

export const useCreateShareLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shareApi.createLink,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['share-links', variables.fileId] })
      toast.success('Share link created!')
    },
    onError: () => {
      toast.error('Failed to create share link')
    }
  })
}

export const useRevokeShareLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shareApi.revokeLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share-links'] })
      toast.success('Link revoked!')
    },
    onError: () => {
      toast.error('Failed to revoke link')
    }
  })
}
