'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FolderTree,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFolders } from '@/lib/queries/folders'
import { FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type SidebarProps = {
  currentFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: () => void
}

export function Sidebar({ currentFolderId, onFolderSelect, onCreateFolder }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { data: folders } = useFolders()
  const pathname = usePathname()
  const router = useRouter()

  const rootFolders = folders?.filter(f => !f.parentId) || []

  const handleFolderClick = (folderId: string | null) => {
    if (pathname !== '/dashboard') {
      router.push('/dashboard')
    }
    onFolderSelect(folderId)
  }

  const renderFolderTree = (parentId: string | null, level: number = 0) => {
    const childFolders = folders?.filter(f => f.parentId === parentId) || []

    return childFolders.map(folder => (
      <div key={folder.id}>
        <Button
          variant="ghost"
          onClick={() => handleFolderClick(folder.id)}
          className={cn(
            'w-full justify-start text-white hover:bg-white/10',
            currentFolderId === folder.id && 'bg-white/20'
          )}
          style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
        >
          <FolderOpen className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
          <span className="truncate text-sm">{folder.name}</span>
        </Button>
        {renderFolderTree(folder.id, level + 1)}
      </div>
    ))
  }

  return (
    <div
      className={cn(
        'h-screen bg-slate-900/50 backdrop-blur-lg border-r border-white/10 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold text-white">CloudBox</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2 mb-6">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-white cursor-pointer',
                  pathname === '/dashboard' && !currentFolderId && 'bg-white/20'
                )}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                All Files
              </Button>
            </Link>

            <Link href="/dashboard/analytics">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-white cursor-pointer',
                  pathname === '/dashboard/analytics' && 'bg-white/20'
                )}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>

            <div className="space-y-1">
              {rootFolders.map(folder => (
                <div key={folder.id}>
                  <Button
                    variant="ghost"
                    onClick={() => onFolderSelect(folder.id)}
                    className={cn(
                      'w-full justify-start text-white cursor-pointer',
                      currentFolderId === folder.id && 'bg-white/20'
                    )}
                  >
                    <FolderOpen className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                    <span className="truncate text-sm">{folder.name}</span>
                  </Button>
                  {renderFolderTree(folder.id, 0)}
                </div>
              ))}

              {rootFolders.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No folders yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex-1 flex flex-col items-center gap-4 py-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-10 h-10 p-0 text-white cursor-pointer',
                pathname === '/dashboard' && 'bg-white/20'
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/dashboard/analytics">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-10 h-10 p-0 text-white cursor-pointer',
                pathname === '/dashboard/analytics' && 'bg-white/20'
              )}
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateFolder}
            className="w-10 h-10 p-0 text-white cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
