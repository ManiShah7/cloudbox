'use client'

import { useStorageStats } from '@/lib/queries/files'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { getCategoryConfig } from '@/lib/constants/categories'

export function CategoryStats() {
  const { data: stats, isLoading } = useStorageStats()

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 animate-pulse">
        <div className="h-64" />
      </Card>
    )
  }

  if (!stats) return null

  const categories = Object.entries(stats.categoryStats)
    .map(([category, count]) => {
      const config = getCategoryConfig(category)
      return {
        category,
        count,
        icon: config.icon,
        label: config.label
      }
    })
    .sort((a, b) => b.count - a.count)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Files by Category</h3>

        <div className="space-y-3">
          {categories.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <item.icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {item.count} {item.count === 1 ? 'file' : 'files'}
              </Badge>
            </motion.div>
          ))}

          {categories.length === 0 && (
            <p className="text-center text-slate-400 py-8">No files yet</p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
