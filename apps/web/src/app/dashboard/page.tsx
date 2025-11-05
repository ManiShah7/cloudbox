import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardClient } from './dashboard-client'
import { ErrorBoundary } from '@/components/error-boundary'

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <DashboardClient />
      </AuthGuard>
    </ErrorBoundary>
  )
}
