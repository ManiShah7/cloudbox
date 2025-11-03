import axios from 'axios'
import { useAuthStore } from '../store/auth'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })

        useAuthStore.getState().setAuth(data.user, data.accessToken)
        isRefreshing = false
        processQueue(null)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError as Error)
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    const message = error.response?.data?.error || error.message || 'Something went wrong'
    const status = error.response?.status

    if (status === 403) {
      toast.error('You do not have permission to perform this action')
    } else if (status === 404) {
      toast.error('Resource not found')
    } else if (status === 413) {
      toast.error('File is too large. Maximum size is 100MB.')
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.')
    } else if (status && status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (!navigator.onLine) {
      toast.error('No internet connection')
    } else if (status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)
