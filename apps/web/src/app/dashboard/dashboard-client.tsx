'use client'

import { useFolders, useDeleteFolder } from '@/lib/queries/folders'
import { CreateFolderModal } from '@/components/folders/create-folder-modal'
import { Folder, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFiles, useDeleteFile, useTogglePublic } from '@/lib/queries/files'
import { Card } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
import { motion } from 'motion/react'
import { Lock, Unlock, Trash2, FileText } from 'lucide-react'
import { UploadDropzone } from '@/components/files/upload-dropzone'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Navbar } from '@/components/layout/navbar'

export function DashboardClient() {
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const deleteFolder = useDeleteFolder()
  const { data: files, isLoading } = useFiles()
  const deleteFile = useDeleteFile()
  const togglePublic = useTogglePublic()

  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    id: string
    type: 'file' | 'folder'
    name: string
  } | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Your Files</h2>
            <p className="text-slate-300">
              {files?.length || 0} files • {folders?.length || 0} folders
            </p>
          </div>
          <Button
            onClick={() => setCreateFolderOpen(true)}
            variant="outline"
            className="border-white/20 cursor-pointer hover:bg-white/50"
          >
            <Folder className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </motion.div>

        <UploadDropzone />

        {foldersLoading ? (
          <p className="text-white">Loading folders...</p>
        ) : folders && folders.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Folders</h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {folders.map((folder, index) => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
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
        ) : null}

        {isLoading ? (
          <div className="text-center text-white py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              ⚡
            </motion.div>
            <p className="mt-4">Loading your files...</p>
          </div>
        ) : files && files.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
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
                  <p className="text-sm text-slate-300 mb-4">
                    {formatBytes(file.size)} • {file.isPublic ? 'Public' : 'Private'}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublic.mutate(file.id)}
                      className="flex-1 border-white/20 cursor-pointer text-black hover:bg-white/50 cursor-pointer"
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
                      onClick={() =>
                        setDeleteConfirm({
                          open: true,
                          id: file.id,
                          type: 'file',
                          name: file.name
                        })
                      }
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto border border-white/20 cursor-pointer">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-bold text-white mb-2">No files yet</h3>
              <p className="text-slate-300">Use the dropzone above to upload your first file!</p>
            </div>
          </motion.div>
        )}
      </main>

      <CreateFolderModal open={createFolderOpen} onOpenChange={setCreateFolderOpen} />

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
    </div>
  )
}
