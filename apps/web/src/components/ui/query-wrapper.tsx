'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

type QueryWrapperProps = {
  isLoading: boolean
  isError: boolean
  error?: Error | null
  isEmpty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: ReactNode
  loadingComponent?: ReactNode
}

export function QueryWrapper({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No data available',
  onRetry,
  children,
  loadingComponent
}: QueryWrapperProps) {
  if (isLoading) {
    return <>{loadingComponent || <div className="text-white">Loading...</div>}</>
  }

  if (isError) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-500/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load data</h3>
          <p className="text-slate-300 mb-4 text-sm">
            {error?.message || 'An error occurred while fetching data'}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="border-white/20 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8">
        <p className="text-center text-slate-400">{emptyMessage}</p>
      </Card>
    )
  }

  return <>{children}</>
}
