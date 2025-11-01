'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { useLogout } from '@/lib/queries/auth'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'

export function Navbar() {
  const { user } = useAuthStore()
  const router = useRouter()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push('/auth/login')
      }
    })
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white"
        >
          <Link href="/dashboard">CloudBox</Link>
        </motion.h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-slate-200">Welcome, {user.name}</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white/20 text-black cursor-pointer hover:bg-white/50"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
