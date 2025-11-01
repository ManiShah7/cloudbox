'use client'

import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { StorageChart } from '@/components/dashboard/storage-chart'
import { CategoryStats } from '@/components/dashboard/category-stats'
import { motion } from 'motion/react'
import { useState } from 'react'
import { CreateFolderModal } from '@/components/folders/create-folder-modal'

export default function AnalyticsPage() {
  const [createFolderOpen, setCreateFolderOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Sidebar
        currentFolderId={null}
        onFolderSelect={() => {}}
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
            <h2 className="text-4xl font-bold text-white mb-2">Analytics</h2>
            <p className="text-slate-300">View your storage statistics and insights</p>
          </motion.div>

          <StatsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StorageChart />
            </div>
            <div>
              <CategoryStats />
            </div>
          </div>
        </main>
      </div>

      <CreateFolderModal open={createFolderOpen} onOpenChange={setCreateFolderOpen} />
    </div>
  )
}
