'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Lock, Unlock, Share2, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import { format } from 'date-fns'
import type { FileRecord } from 'shared/types'
import { getCategoryConfig } from '@/lib/constants/categories'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type SortField = 'name' | 'size' | 'createdAt' | 'category'
type SortOrder = 'asc' | 'desc'

type FileListViewProps = {
  files: FileRecord[]
  onPreview: (file: FileRecord) => void
  onShare: (fileId: string, fileName: string) => void
  onTogglePublic: (fileId: string) => void
  onDelete: (fileId: string, fileName: string) => void
}

export function FileListView({
  files,
  onPreview,
  onShare,
  onTogglePublic,
  onDelete
}: FileListViewProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'size':
        comparison = a.size - b.size
        break
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'category':
        comparison = (a.category || '').localeCompare(b.category || '')
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-white transition-colors"
    >
      {children}
      {sortField === field &&
        (sortOrder === 'asc' ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        ))}
    </button>
  )

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-400">
        <div className="col-span-5">
          <SortButton field="name">Name</SortButton>
        </div>
        <div className="col-span-2">
          <SortButton field="category">Category</SortButton>
        </div>
        <div className="col-span-2">
          <SortButton field="size">Size</SortButton>
        </div>
        <div className="col-span-2">
          <SortButton field="createdAt">Modified</SortButton>
        </div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {sortedFiles.map(file => {
          const categoryConfig = getCategoryConfig(file.category || 'other')
          const Icon = categoryConfig.icon

          return (
            <div
              key={file.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group"
              onClick={() => onPreview(file)}
            >
              {/* Name */}
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="p-2 bg-blue-500/10 rounded">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate font-medium group-hover:text-blue-300 transition-colors">
                    {file.name}
                  </p>
                  {file.description && (
                    <p className="text-xs text-slate-400 truncate">{file.description}</p>
                  )}
                </div>
                {file.isPublic ? (
                  <Unlock className="w-3 h-3 text-green-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                )}
              </div>

              {/* Category */}
              <div className="col-span-2 flex items-center">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${categoryConfig.color}20`,
                    color: categoryConfig.color
                  }}
                >
                  {categoryConfig.label}
                </span>
              </div>

              {/* Size */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-slate-300">{formatBytes(file.size)}</span>
              </div>

              {/* Modified */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-slate-300">
                  {format(new Date(file.createdAt), 'MMM d, yyyy')}
                </span>
              </div>

              {/* Actions */}
              <div
                className="col-span-1 flex items-center justify-end"
                onClick={e => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-slate-900 border-white/20 text-white"
                  >
                    <DropdownMenuItem
                      onClick={() => onShare(file.id, file.name)}
                      className="hover:bg-white/10 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onTogglePublic(file.id)}
                      className="hover:bg-white/10 cursor-pointer"
                    >
                      {file.isPublic ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Make Public
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(file.id, file.name)}
                      className="hover:bg-red-500/20 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
