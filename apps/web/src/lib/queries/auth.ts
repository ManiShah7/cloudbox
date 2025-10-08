import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth'
import type { LoginCredentials, RegisterData } from 'shared/schemas'
import { toast } from 'sonner'

export const useLogin = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: data => {
      setAuth(data.user, data.accessToken)
      queryClient.invalidateQueries()
      toast.success('Login successful!')
    },
    onError: () => {
      toast.error('Invalid email or password')
    }
  })
}

export const useRegister = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: data => {
      setAuth(data.user, data.accessToken)
      queryClient.invalidateQueries()
      toast.success('Registration successful!')
    },
    onError: () => {
      toast.error('Registration failed')
    }
  })
}

export const useLogout = () => {
  const logout = useAuthStore(state => state.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged out successfully')
    }
  })
}
