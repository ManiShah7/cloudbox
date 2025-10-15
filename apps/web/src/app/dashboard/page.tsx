'use client'

import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/lib/queries/auth'
import { useFiles, useUploadFile, useDeleteFile, useTogglePublic } from '@/lib/queries/files'
import { Card } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'

export default function DashboardPage() {
  const authState = useAuthStore()
  const { user } = authState
  const router = useRouter()
  const logout = useLogout()
  const { data: files, isLoading } = useFiles()
  const uploadFile = useUploadFile()
  const deleteFile = useDeleteFile()
  const togglePublic = useTogglePublic()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push('/auth/login')
      }
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile.mutate({ file })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">CloudBox</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Files</h2>
          <div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
            <Button onClick={() => fileInputRef.current?.click()}>Upload File</Button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading files...</p>
        ) : files && files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map(file => (
              <Card key={file.id} className="p-4">
                <h3 className="font-semibold truncate mb-2">{file.name}</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {formatBytes(file.size)} • {file.isPublic ? 'Public' : 'Private'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => togglePublic.mutate(file.id)}>
                    {file.isPublic ? 'Make Private' : 'Make Public'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteFile.mutate(file.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No files yet. Upload your first file!</p>
        )}
      </main>
    </div>
  )
}
