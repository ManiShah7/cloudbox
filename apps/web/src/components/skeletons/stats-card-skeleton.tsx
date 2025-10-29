import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function StatsCardSkeleton() {
  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
      </div>
      <Skeleton className="h-8 w-20 mb-1 bg-white/10" />
      <Skeleton className="h-4 w-24 bg-white/10" />
    </Card>
  )
}
