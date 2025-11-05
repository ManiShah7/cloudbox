'use client'

import { FolderListView } from '@/components/folders/folder-list-view'
import { FileListView } from '@/components/files/file-list-view'
import { ViewToggle } from '@/components/files/view-toggle'
import { useFolders, useDeleteFolder } from '@/lib/queries/folders'
import { CreateFolderModal } from '@/components/folders/create-folder-modal'
import { useFiles, useDeleteFile, useTogglePublic } from '@/lib/queries/files'
import { motion } from 'motion/react'
import { UploadDropzone } from '@/components/files/upload-dropzone'
import { useEffect, useState } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Navbar } from '@/components/layout/navbar'
import { Breadcrumb } from '@/components/folders/breadcrumb'
import { EmptyFolder } from '@/components/folders/empty-folder'
import { FilePreviewModal } from '@/components/files/file-preview-modal'
import type { FileRecord } from 'shared/types'
import { useAnalyzeFile } from '@/lib/queries/files'
import { SearchBar } from '@/components/files/search-bar'
import { EmptyState } from '@/components/dashboard/empty-state'
import { ShareModal } from '@/components/share/share-modal'
import { FileCardSkeleton } from '@/components/skeletons/file-card-skeleton'
import { FolderCardSkeleton } from '@/components/skeletons/folder-card-skeleton'
import { Sidebar } from '@/components/layout/sidebar'
import { useRouter } from 'next/navigation'
import { FileCard } from '@/components/files/file-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FolderOpen, Trash2 } from 'lucide-react'

type DashboardClientProps = {
  initialFolderId?: string
}

export function DashboardClient({ initialFolderId }: DashboardClientProps = {}) {
  const router = useRouter()

  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    id: string
    type: 'file' | 'folder'
    name: string
  } | null>(null)
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolderId || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [shareModal, setShareModal] = useState<{ fileId: string; fileName: string } | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolderId(folderId)
    if (folderId) {
      router.push(`/dashboard/folder/${folderId}`)
    } else {
      router.push('/dashboard')
    }
  }

  const { data: folders, isLoading: foldersLoading } = useFolders()
  const deleteFolder = useDeleteFolder()
  const { data: files, isLoading: filesLoading } = useFiles({
    search: searchQuery,
    category: selectedCategory !== 'all' ? selectedCategory : undefined
  })
  const deleteFile = useDeleteFile()
  const togglePublic = useTogglePublic()
  const analyzeFile = useAnalyzeFile()

  const filteredFolders = folders?.filter(f => f.parentId === currentFolderId) || []
  const filteredFiles = files?.filter(f => f.folderId === currentFolderId) || []

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('fileViewMode', mode)
  }

  useEffect(() => {
    const saved = localStorage.getItem('fileViewMode')
    if (saved === 'grid' || saved === 'list') {
      setViewMode(saved)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Sidebar
        currentFolderId={currentFolderId}
        onFolderSelect={handleFolderSelect}
        onCreateFolder={() => setCreateFolderOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Breadcrumb
              currentFolderId={currentFolderId}
              folders={folders || []}
              onNavigate={handleFolderSelect}
            />
          </motion.div>

          <SearchBar
            onSearch={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <div className="flex items-center justify-end mb-6">
            <ViewToggle view={viewMode} onViewChange={handleViewChange} />
          </div>

          <UploadDropzone />

          {foldersLoading &&
            (viewMode === 'grid' ? (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <FolderCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
                <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-4">
                  <p className="text-slate-400 text-sm">Loading folders...</p>
                </div>
              </div>
            ))}

          {!foldersLoading &&
            filteredFolders.length > 0 &&
            (viewMode === 'grid' ? (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filteredFolders.map((folder, index) => (
                    <motion.div
                      key={folder.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={() => handleFolderSelect(folder.id)}
                      className="group cursor-pointer"
                    >
                      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <FolderOpen className="w-8 h-8 text-blue-400" />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={e => {
                              e.stopPropagation()
                              setDeleteConfirm({
                                open: true,
                                id: folder.id,
                                type: 'folder',
                                name: folder.name
                              })
                            }}
                            className="transition-opacity cursor-pointer bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-white truncate">{folder.name}</h3>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
                <FolderListView
                  folders={filteredFolders}
                  onFolderClick={handleFolderSelect}
                  onDelete={(folderId, folderName) =>
                    setDeleteConfirm({
                      open: true,
                      id: folderId,
                      type: 'folder',
                      name: folderName
                    })
                  }
                />
              </motion.div>
            ))}

          {filesLoading &&
            (viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <FileCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-4">
                <p className="text-slate-400 text-sm">Loading files...</p>
              </div>
            ))}

          {!filesLoading &&
            filteredFiles &&
            filteredFiles.length > 0 &&
            (viewMode === 'grid' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              >
                {filteredFiles.map((file, index) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    index={index}
                    onPreview={setPreviewFile}
                    onShare={(fileId, fileName) => setShareModal({ fileId, fileName })}
                    onTogglePublic={fileId => togglePublic.mutate(fileId)}
                    onDelete={(fileId, fileName) =>
                      setDeleteConfirm({
                        open: true,
                        id: fileId,
                        type: 'file',
                        name: fileName
                      })
                    }
                    onAnalyze={fileId => analyzeFile.mutate(fileId)}
                    isAnalyzing={analyzeFile.isPending}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FileListView
                  files={filteredFiles}
                  onPreview={setPreviewFile}
                  onShare={(fileId, fileName) => setShareModal({ fileId, fileName })}
                  onTogglePublic={fileId => togglePublic.mutate(fileId)}
                  onDelete={(fileId, fileName) =>
                    setDeleteConfirm({
                      open: true,
                      id: fileId,
                      type: 'file',
                      name: fileName
                    })
                  }
                />
              </motion.div>
            ))}

          {!filesLoading &&
            !foldersLoading &&
            filteredFiles.length === 0 &&
            filteredFolders.length === 0 &&
            (files?.length === 0 && folders?.length === 0 ? <EmptyState /> : <EmptyFolder />)}
        </main>
      </div>

      <CreateFolderModal
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        parentId={currentFolderId || undefined}
      />

      <ConfirmDialog
        open={deleteConfirm?.open || false}
        onOpenChange={open => !open && setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm?.type === 'folder') {
            deleteFolder.mutate(deleteConfirm.id)
          } else if (deleteConfirm?.type === 'file') {
            deleteFile.mutate(deleteConfirm.id)
          }
          setDeleteConfirm(null)
        }}
        title={`Delete ${deleteConfirm?.type}?`}
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
      />

      <FilePreviewModal
        file={previewFile}
        open={!!previewFile}
        onOpenChange={open => !open && setPreviewFile(null)}
      />

      <ShareModal
        fileId={shareModal?.fileId || ''}
        fileName={shareModal?.fileName || ''}
        open={!!shareModal}
        onOpenChange={open => !open && setShareModal(null)}
      />
    </div>
  )
}
