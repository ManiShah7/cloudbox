'use client'

import { useStorageStats } from '@/lib/queries/files'
import { Card } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'motion/react'
import { getCategoryConfig } from '@/lib/constants/categories'

export function StorageChart() {
  const { data: stats, isLoading } = useStorageStats()

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 animate-pulse">
        <div className="h-80" />
      </Card>
    )
  }

  if (!stats) return null

  const chartData = Object.entries(stats.storageByCategory)
    .map(([category, size]) => {
      const config = getCategoryConfig(category)
      return {
        category: config.label,
        size: size,
        sizeFormatted: formatBytes(size),
        color: config.color
      }
    })
    .sort((a, b) => b.size - a.size)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Storage by Category</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={value => formatBytes(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => formatBytes(value)}
            />
            <Bar dataKey="size" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {chartData.map(item => (
            <div key={item.category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-300">
                {item.category}: {item.sizeFormatted}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
