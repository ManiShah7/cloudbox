'use client'

import { useStorageStats } from '@/lib/queries/files'
import { Card } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
import { motion } from 'motion/react'
import { HardDrive, FileText, Sparkles, TrendingUp } from 'lucide-react'
import { StatsCardSkeleton } from '@/components/skeletons/stats-card-skeleton'

export function StatsOverview() {
  const { data: stats, isLoading } = useStorageStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: 'Total Storage',
      value: formatBytes(stats.totalSize),
      icon: HardDrive,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Total Files',
      value: stats.totalFiles.toString(),
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'AI Analyzed',
      value: `${stats.aiAnalyzedPercentage.toFixed(0)}%`,
      icon: Sparkles,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Recent Uploads',
      value: `${stats.recentUploads} / 7 days`,
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-300">{stat.title}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
