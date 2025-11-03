'use client'

import { useFolders, useDeleteFolder } from '@/lib/queries/folders'
import { CreateFolderModal } from '@/components/folders/create-folder-modal'
import { useFiles, useDeleteFile, useTogglePublic } from '@/lib/queries/files'
import { motion } from 'motion/react'
import { UploadDropzone } from '@/components/files/upload-dropzone'
import { useState } from 'react'
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
import { FolderCard } from '@/components/folders/folder-card'

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

          <UploadDropzone />

          {foldersLoading && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <FolderCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {!foldersLoading && filteredFolders.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredFolders.map((folder, index) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    index={index}
                    onFolderSelect={handleFolderSelect}
                    onDeleteFolder={(folderId, folderName) =>
                      setDeleteConfirm({
                        open: true,
                        id: folderId,
                        type: 'folder',
                        name: folderName
                      })
                    }
                  />
                ))}
              </motion.div>
            </div>
          )}

          {filesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <FileCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!filesLoading && filteredFiles && filteredFiles.length > 0 && (
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
          )}

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
