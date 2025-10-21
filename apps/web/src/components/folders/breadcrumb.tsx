'use client'

import { ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Folder } from 'shared/types'

type BreadcrumbProps = {
  currentFolderId: string | null
  folders: Folder[]
  onNavigate: (folderId: string | null) => void
}

export function Breadcrumb({ currentFolderId, folders, onNavigate }: BreadcrumbProps) {
  const buildPath = (folderId: string | null): { id: string | null; name: string }[] => {
    if (!folderId) return [{ id: null, name: 'Home' }]

    const folder = folders.find(f => f.id === folderId)
    if (!folder) return [{ id: null, name: 'Home' }]

    const parentPath = buildPath(folder.parentId)
    return [...parentPath, { id: folder.id, name: folder.name }]
  }

  const path = buildPath(currentFolderId)

  return (
    <div className="flex items-center gap-2 mb-6 p-3 bg-white/5 rounded-lg border border-white/10">
      {path.map((item, index) => (
        <div key={item.id || 'home'} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={`text-white hover:bg-white/50 cursor-pointer ${
              index === path.length - 1 ? 'font-semibold text-blue-400' : 'text-slate-300'
            }`}
          >
            {index === 0 && <Home className="w-4 h-4 mr-1" />}
            {item.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
