'use client'

import { Button } from '@/components/ui/button'
import { Grid3x3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list'

type ViewToggleProps = {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-white/5 backdrop-blur-lg rounded-lg p-1 border border-white/10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn('h-8 px-3 text-white hover:bg-white/10', view === 'grid' && 'bg-white/20')}
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn('h-8 px-3 text-white hover:bg-white/10', view === 'list' && 'bg-white/20')}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
}
