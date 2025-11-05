import { create } from 'zustand'
import type { User } from 'shared/types'
import { persist } from 'zustand/middleware'

type AuthState = {
  user: User | null
  accessToken: string | null
  setAuth: (user: User, accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      logout: () => {
        set({ user: null, accessToken: null })
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
