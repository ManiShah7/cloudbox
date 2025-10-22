'use client'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'
import type { FileRecord } from 'shared/types'
import { motion } from 'motion/react'
import Image from 'next/image'

type FilePreviewModalProps = {
  file: FileRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreviewModal({ file, open, onOpenChange }: FilePreviewModalProps) {
  if (!file) return null

  const isImage = file.mimeType.startsWith('image/')
  const isPDF = file.mimeType === 'application/pdf'
  const isText = file.mimeType.startsWith('text/')

  const handleDownload = () => {
    window.open(file.url, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl h-[80vh] bg-slate-900 border-white/20 text-white p-0"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full">
          <DialogHeader>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="max-w-60 text-lg font-semibold truncate flex-1" title={file.name}>
                {file.name}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="border-white/20 text-black hover:bg-white/50 cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-white/50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-4 bg-slate-950">
            {isImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-full"
              >
                <Image
                  src={file.url}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  width={800}
                  height={600}
                />
              </motion.div>
            )}

            {isPDF && (
              <iframe src={file.url} className="w-full h-full rounded-lg" title={file.name} />
            )}

            {isText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 rounded-lg p-4 h-full overflow-auto"
              >
                <iframe
                  src={file.url}
                  className="w-full h-full"
                  title={file.name}
                  style={{ border: 'none' }}
                />
              </motion.div>
            )}

            {!isImage && !isPDF && !isText && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-slate-300 mb-4">Preview not available for this file type</p>
                  <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
