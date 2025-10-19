'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRegister } from '@/lib/queries/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Lock, Mail, User } from 'lucide-react'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = useRegister()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          router.push('/dashboard')
        }
      }
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg  p-8 bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer rounded-lg"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-slate-300">Join CloudBox and start organizing</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="pl-10 bg-white/10 border-white/20 cursor-pointer text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="pl-10 bg-white/10 border-white/20 cursor-pointer text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="pl-10 bg-white/10 border-white/20 cursor-pointer text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
          disabled={register.isPending}
        >
          {register.isPending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              ⚡
            </motion.div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-300 mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
