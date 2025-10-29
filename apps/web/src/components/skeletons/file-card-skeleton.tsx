import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FileCardSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
        <Skeleton className="h-4 w-4 rounded bg-white/10" />
      </div>

      <Skeleton className="h-5 w-3/4 mb-2 bg-white/10" />
      <Skeleton className="h-4 w-1/2 mb-4 bg-white/10" />

      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded bg-white/10" />
        <Skeleton className="h-8 w-8 rounded bg-white/10" />
      </div>
    </Card>
  )
}
