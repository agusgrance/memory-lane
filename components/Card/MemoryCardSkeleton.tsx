import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const MemoryCardSkeleton = () => {
  return (
    <Card className='w-full max-w-3xl'>
      <CardContent className='pt-6 pb-0'>
        <div className='flex gap-4'>
          <Skeleton className='flex-shrink-0 w-20 h-20 rounded-full' />
          <div className='flex-1'>
            <div className='flex items-start justify-between'>
              <div>
                <Skeleton className='w-32 h-6' />
                <Skeleton className='w-24 h-4 mt-1' />
              </div>
            </div>
            <Skeleton className='w-full h-16 mt-2' />
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end pb-2'>
        <Skeleton className='w-8 h-8 rounded-md' />
      </CardFooter>
    </Card>
  )
}
