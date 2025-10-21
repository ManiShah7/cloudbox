'use client'

import { motion } from 'motion/react'
import { FolderOpen } from 'lucide-react'

export function EmptyFolder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="text-center py-10"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto border border-white/20">
        <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">This folder is empty</h3>
        <p className="text-slate-300">Upload files or create subfolders using the options above</p>
      </div>
    </motion.div>
  )
}
