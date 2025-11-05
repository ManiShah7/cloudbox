'use client'

import { Button } from '@/components/ui/button'
import { FolderOpen, Trash2, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import type { Folder } from 'shared/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type FolderListViewProps = {
  folders: Folder[]
  onFolderClick: (folderId: string) => void
  onDelete: (folderId: string, folderName: string) => void
}

export function FolderListView({ folders, onFolderClick, onDelete }: FolderListViewProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden mb-6">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-400">
        <div className="col-span-8">Name</div>
        <div className="col-span-3">Modified</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {folders.map(folder => (
          <div
            key={folder.id}
            className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => onFolderClick(folder.id)}
          >
            {/* Name */}
            <div className="col-span-8 flex items-center gap-3 min-w-0">
              <div className="p-2 bg-blue-500/10 rounded">
                <FolderOpen className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm text-white truncate font-medium group-hover:text-blue-300 transition-colors">
                {folder.name}
              </p>
            </div>

            {/* Modified */}
            <div className="col-span-3 flex items-center">
              <span className="text-sm text-slate-300">
                {format(new Date(folder.createdAt), 'MMM d, yyyy')}
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
                    onClick={() => onDelete(folder.id, folder.name)}
                    className="hover:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
