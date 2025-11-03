'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-500/20 rounded-full mb-4">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-slate-300 mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.href = '/dashboard'
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
