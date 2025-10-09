'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/auth'
import { authApi } from '../api/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const initAuth = async () => {
      try {
        const data = await authApi.refresh()
        setAuth(data.user, data.accessToken)
      } catch (error) {
        console.log('No valid session', error)
      }
    }

    initAuth()
  }, [setAuth])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
