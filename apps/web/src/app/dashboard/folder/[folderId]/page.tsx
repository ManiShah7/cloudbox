'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardClient } from '@/app/dashboard/dashboard-client'
import { use } from 'react'

type PageProps = {
  params: Promise<{ folderId: string }>
}

export default function FolderPage({ params }: PageProps) {
  const { folderId } = use(params)

  return (
    <AuthGuard>
      <DashboardClient initialFolderId={folderId} />
    </AuthGuard>
  )
}
