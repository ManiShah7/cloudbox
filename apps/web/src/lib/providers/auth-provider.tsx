'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/auth'
import { authApi } from '../api/auth'
import { AxiosError } from 'axios'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initAuth = async () => {
      try {
        const data = await authApi.refresh()
        setAuth(data.user, data.accessToken)
      } catch (error) {
        // If refresh fails, backend clears the cookie and middleware handles redirect
        if (error instanceof AxiosError && error.response?.status === 401) {
          console.error('Not authenticated - cookie cleared by backend')
        }
      }
    }

    initAuth()
  }, [setAuth])

  return <>{children}</>
}
