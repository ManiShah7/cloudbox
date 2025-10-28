'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'

export default function HomePage() {
  const auth = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-20">
          <h1 className="text-2xl font-bold text-white">CloudBox</h1>
          <div className="flex gap-4">
            {auth.user ? (
              <Link href="/dashboard">
                <Button className="cursor-pointer">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="cursor-pointer">
                    Login
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button className="cursor-pointer">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        <main className="text-center">
          <h2 className="text-6xl font-bold text-white mb-6">AI-Powered File Storage</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Smart organization, version control, and real-time collaboration. Store your files the
            intelligent way.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">🤖 AI Organization</h3>
              <p className="text-slate-300">
                Automatically categorize and tag your files with intelligent AI
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">📝 Version Control</h3>
              <p className="text-slate-300">
                Track changes and revert to any version with Git-like control
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">👥 Collaboration</h3>
              <p className="text-slate-300">Real-time annotations and comments on any file type</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
