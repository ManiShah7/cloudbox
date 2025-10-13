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
        console.log('Auth refreshed', data)
        setAuth(data.user, data.accessToken)
      } catch (error) {
        // Middleware already handles redirects, just log the error
        if (error instanceof AxiosError && error.response?.status === 401) {
          // No valid session - middleware will redirect if needed
        }
      }
    }

    initAuth()
  }, [setAuth])

  return <>{children}</>
}
