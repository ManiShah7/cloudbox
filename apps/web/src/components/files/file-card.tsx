'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Lock, Unlock, Share2, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { formatBytes } from '@/lib/utils'
import { AITags } from './ai-tags'
import type { FileRecord } from 'shared/types'

type FileCardProps = {
  file: FileRecord
  index: number
  onPreview: (file: FileRecord) => void
  onShare: (fileId: string, fileName: string) => void
  onTogglePublic: (fileId: string) => void
  onDelete: (fileId: string, fileName: string) => void
  onAnalyze: (fileId: string) => void
  isAnalyzing: boolean
}

export function FileCard({
  file,
  index,
  onPreview,
  onShare,
  onTogglePublic,
  onDelete,
  onAnalyze,
  isAnalyzing
}: FileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Card
        className="bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer p-4 lg:p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
        onClick={() => onPreview(file)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
          </div>
          <div className="flex gap-1">
            {file.isPublic ? (
              <Unlock className="w-4 h-4 text-green-400" />
            ) : (
              <Lock className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        <h3 className="font-semibold text-white truncate mb-2 group-hover:text-blue-300 transition-colors text-sm lg:text-base">
          {file.name}
        </h3>

        <div className="mb-3">
          <AITags
            category={file.category}
            tags={file.tags || []}
            aiAnalyzed={file.aiAnalyzed || false}
            onAnalyze={() => onAnalyze(file.id)}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {file.description && (
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">{file.description}</p>
        )}

        <p className="text-xs lg:text-sm text-slate-300 mb-4">
          {formatBytes(file.size)} • {file.isPublic ? 'Public' : 'Private'}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={e => {
              e.stopPropagation()
              onShare(file.id, file.name)
            }}
            className="flex-1 py-2 border-white/20 hover:bg-white/10 cursor-pointer text-xs lg:text-sm"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={e => {
              e.stopPropagation()
              onTogglePublic(file.id)
            }}
            className="flex-1 py-2 border-white/20 cursor-pointer text-black hover:bg-white/50 text-xs lg:text-sm"
          >
            {file.isPublic ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Private
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 mr-1" />
                Public
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={e => {
              e.stopPropagation()
              onDelete(file.id, file.name)
            }}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 sm:w-auto w-full"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
