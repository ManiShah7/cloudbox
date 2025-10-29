import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FolderCardSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-8 w-8 rounded bg-white/10" />
        <Skeleton className="h-6 w-6 rounded bg-white/10" />
      </div>
      <Skeleton className="h-5 w-2/3 bg-white/10" />
    </Card>
  )
}
