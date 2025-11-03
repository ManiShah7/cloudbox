'use client'

import { DashboardClient } from '../../dashboard-client'
import { use } from 'react'

type PageProps = {
  params: Promise<{ folderId: string }>
}

export default function FolderPage({ params }: PageProps) {
  const { folderId } = use(params)

  return <DashboardClient initialFolderId={folderId} />
}
