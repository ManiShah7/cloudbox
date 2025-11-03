'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, BarChart3, ChevronLeft, ChevronRight, Plus, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFolders } from '@/lib/queries/folders'
import { FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SidebarProps = {
  currentFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: () => void
}

export function Sidebar({ currentFolderId, onFolderSelect, onCreateFolder }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: folders } = useFolders()
  const pathname = usePathname()

  const rootFolders = folders?.filter(f => !f.parentId) || []

  const handleFolderClick = (folderId: string | null) => {
    onFolderSelect(folderId)
    setMobileOpen(false)
  }

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, currentFolderId])

  const renderFolderTree = (parentId: string | null, level: number = 0) => {
    const childFolders = folders?.filter(f => f.parentId === parentId) || []

    return childFolders.map(folder => (
      <div key={folder.id}>
        <Button
          variant="ghost"
          onClick={() => handleFolderClick(folder.id)}
          className={cn(
            'w-full justify-start text-white mb-1',
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
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden text-white bg-slate-900/80 backdrop-blur-lg hover:bg-slate-800"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          'h-screen bg-slate-900/95 backdrop-blur-lg border-r border-white/10 transition-all duration-300 flex flex-col',
          'fixed lg:relative z-40',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {!collapsed && <h2 className="text-xl font-bold text-white">CloudBox</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hidden lg:flex cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {!collapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2 mb-6">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
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

              <Link href="/dashboard/analytics" onClick={() => setMobileOpen(false)}>
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
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Folders</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateFolder}
                  className="h-6 w-6 p-0 text-slate-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {rootFolders.map(folder => (
                  <div key={folder.id}>
                    <Button
                      variant="ghost"
                      onClick={() => handleFolderClick(folder.id)}
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
                  'w-10 h-10 p-0 text-white',
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
              className="w-10 h-10 p-0 text-white "
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
