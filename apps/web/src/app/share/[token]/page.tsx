'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import { Download, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
import type { PublicFileResponse } from 'shared/schemas'
import Image from 'next/image'

export default function SharedFilePage() {
  const params = useParams()
  const token = params.token as string
  const [file, setFile] = useState<PublicFileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/share/${token}`)

        if (!res.ok) {
          if (res.status === 404) {
            setError('Link not found')
          } else if (res.status === 410) {
            setError('Link expired')
          } else {
            setError('Failed to load file')
          }
          return
        }

        const data = await res.json()
        setFile(data)
      } catch (err) {
        setError('Failed to load file')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-12 text-center">
          <p className="text-red-400 text-xl">{error}</p>
        </Card>
      </div>
    )
  }

  if (!file) return null

  const isImage = file.file.mimeType.startsWith('image/')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/20 rounded-lg">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{file.file.name}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span>{formatBytes(file.file.size)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {file.viewCount} views
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => window.open(file.file.url, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {isImage && (
            <div className="mt-6 rounded-lg overflow-hidden bg-black/30 p-4">
              <div className="relative w-full h-[600px]">
                <Image
                  src={file.file.url}
                  alt={file.file.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
