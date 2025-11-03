import { DashboardClient } from './dashboard-client'
import { ErrorBoundary } from '@/components/error-boundary'

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardClient />
    </ErrorBoundary>
  )
}
