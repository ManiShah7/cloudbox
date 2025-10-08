import type { LoginCredentials, RegisterData } from 'shared/schemas'
import type { AuthResponse } from 'shared/types'
import { apiClient } from './client'

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  register: async (userData: RegisterData) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData)
    return data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
  },

  refresh: async () => {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh')
    return data
  }
}
