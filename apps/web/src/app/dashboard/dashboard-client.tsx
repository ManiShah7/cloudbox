'use client'

import { useFolders, useDeleteFolder } from '@/lib/queries/folders'
import { CreateFolderModal } from '@/components/folders/create-folder-modal'
import { FolderOpen, Share2, Lock, Unlock, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFiles, useDeleteFile, useTogglePublic } from '@/lib/queries/files'
import { Card } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
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
import { AITags } from '@/components/files/ai-tags'
import { SearchBar } from '@/components/files/search-bar'
import { EmptyState } from '@/components/dashboard/empty-state'
import { ShareModal } from '@/components/share/share-modal'
import { FileCardSkeleton } from '@/components/skeletons/file-card-skeleton'
import { FolderCardSkeleton } from '@/components/skeletons/folder-card-skeleton'
import { Sidebar } from '@/components/layout/sidebar'

export function DashboardClient() {
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    id: string
    type: 'file' | 'folder'
    name: string
  } | null>(null)
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [shareModal, setShareModal] = useState<{ fileId: string; fileName: string } | null>(null)

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
        onFolderSelect={setCurrentFolderId}
        onCreateFolder={() => setCreateFolderOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Breadcrumb
              currentFolderId={currentFolderId}
              folders={folders || []}
              onNavigate={setCurrentFolderId}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredFolders.map((folder, index) => (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setCurrentFolderId(folder.id)}
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
          )}

          {filesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <FileCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!filesLoading && filteredFiles && filteredFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card
                    className="bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                    onClick={() => setPreviewFile(file)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex gap-1">
                        {file.isPublic ? (
                          <Unlock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-white truncate mb-2 group-hover:text-blue-300 transition-colors">
                      {file.name}
                    </h3>

                    <div className="mb-3">
                      <AITags
                        category={file.category}
                        tags={file.tags || []}
                        aiAnalyzed={file.aiAnalyzed || false}
                        onAnalyze={() => analyzeFile.mutate(file.id)}
                        isAnalyzing={analyzeFile.isPending}
                      />
                    </div>

                    {file.description && (
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{file.description}</p>
                    )}

                    <p className="text-sm text-slate-300 mb-4">
                      {formatBytes(file.size)} • {file.isPublic ? 'Public' : 'Private'}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation()
                          setShareModal({ fileId: file.id, fileName: file.name })
                        }}
                        className="flex-1 border-white/20 hover:bg-white/10 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation()
                          togglePublic.mutate(file.id)
                        }}
                        className="flex-1 border-white/20 cursor-pointer text-black hover:bg-white/50"
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
                          setDeleteConfirm({
                            open: true,
                            id: file.id,
                            type: 'file',
                            name: file.name
                          })
                        }}
                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
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
