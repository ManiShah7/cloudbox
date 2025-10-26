'use client'

import { motion } from 'motion/react'
import { Upload, FolderPlus, Sparkles } from 'lucide-react'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center py-20"
    >
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 max-w-2xl mx-auto border border-white/10">
        <div className="flex justify-center gap-4 mb-6">
          <div className="p-4 bg-blue-500/20 rounded-full">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <div className="p-4 bg-purple-500/20 rounded-full">
            <FolderPlus className="w-8 h-8 text-purple-400" />
          </div>
          <div className="p-4 bg-green-500/20 rounded-full">
            <Sparkles className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">Welcome to CloudBox!</h3>
        <p className="text-slate-300 mb-6">
          Start by uploading your first file or creating a folder.
          <br />
          Our AI will automatically organize and tag your files.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-slate-400">
          <span>📤 Drag & drop files</span>
          <span className="hidden sm:inline">•</span>
          <span>📁 Create folders</span>
          <span className="hidden sm:inline">•</span>
          <span>🤖 AI auto-tagging</span>
        </div>
      </div>
    </motion.div>
  )
}
