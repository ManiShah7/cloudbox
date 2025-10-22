'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

type AITagsProps = {
  category?: string | null
  tags: string[]
  aiAnalyzed: boolean
  onAnalyze: () => void
  isAnalyzing?: boolean
}

export function AITags({ category, tags, aiAnalyzed, onAnalyze, isAnalyzing }: AITagsProps) {
  if (!aiAnalyzed) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={e => {
          e.stopPropagation()
          onAnalyze()
        }}
        disabled={isAnalyzing}
        className={clsx(
          'border-purple-500/30 text-purple-400 hover:bg-purple-500/10 ',
          isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <Sparkles className="w-3 h-3 mr-1" />
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-1"
    >
      {category && (
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{category}</Badge>
      )}
      {tags.slice(0, 3).map(tag => (
        <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          {tag}
        </Badge>
      ))}
    </motion.div>
  )
}
