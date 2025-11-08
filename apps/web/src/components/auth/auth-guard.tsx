'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const { accessToken, setAuth, logout } = useAuthStore()
  const router = useRouter()
  const hasChecked = useRef(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (hasChecked.current) return
      hasChecked.current = true

      if (accessToken) {
        setIsChecking(false)
        return
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        setAuth(data.user, data.accessToken)
        setIsChecking(false)
      } catch {
        logout()
        router.push('/login')
      }
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
