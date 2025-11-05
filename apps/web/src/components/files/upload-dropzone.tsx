'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'motion/react'
import { Upload, FileText } from 'lucide-react'
import { useUploadFile } from '@/lib/queries/files'

export function UploadDropzone() {
  const uploadFile = useUploadFile()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadFile.mutate({ file: acceptedFiles[0] })
      }
    },
    [uploadFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-2xl p-12
          transition-all duration-300 cursor-pointer
          ${
            isDragActive
              ? 'border-blue-400 bg-blue-500/20 scale-105'
              : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="text-center">
          <motion.div
            animate={{
              y: isDragActive ? -10 : 0,
              scale: isDragActive ? 1.1 : 1
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="inline-block mb-4"
          >
            {isDragActive ? (
              <FileText className="w-16 h-16 text-blue-400 mx-auto" />
            ) : (
              <Upload className="w-16 h-16 text-slate-400 mx-auto" />
            )}
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragActive ? 'Drop your file here' : 'Upload your files'}
          </h3>

          <p className="text-slate-300">
            {isDragActive ? 'Release to upload' : 'Drag & drop files here, or click to browse'}
          </p>

          {uploadFile.isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <div className="inline-flex items-center gap-2 text-blue-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⚡
                </motion.div>
                <span>Uploading...</span>
              </div>
            </motion.div>
          )}
        </div>

        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 pointer-events-none"
          />
        )}
      </div>
    </motion.div>
  )
}
