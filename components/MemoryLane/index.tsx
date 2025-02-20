'use client'

import { useEffect, useState } from 'react'
import { MemoryCard } from '../Card'
import { MemoryLaneHeader } from './MemoryLaneHeader'
import { MemoriesResponse, memoryService } from '@/services/api'
import { MemoryCardSkeleton } from '../Card/MemoryCardSkeleton'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { InfiniteData } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '../EmptyState'
import { CreateMemoryModal } from '../CreateMemoryModal'

export const MemoryLane: React.FC = () => {
  const queryClient = useQueryClient()
  const [sortOrder, setSortOrder] = useState<'older' | 'newer'>('older')
  const { ref, inView } = useInView()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<
      MemoriesResponse,
      Error,
      InfiniteData<MemoriesResponse>,
      [string, string],
      number
    >({
      queryKey: ['memories', sortOrder],
      queryFn: ({ pageParam = 1 }) =>
        memoryService.getAll(pageParam, sortOrder),
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
      initialPageParam: 1,
    })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const handleSortChange = (value: string) => {
    setSortOrder(value as 'older' | 'newer')
  }

  if (status === 'pending') {
    return (
      <div className='w-full py-6 mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='w-[180px] h-10' />
          <Skeleton className='w-32 h-10' />
        </div>
        <div className='flex flex-col items-center space-y-4'>
          <MemoryCardSkeleton />
          <MemoryCardSkeleton />
          <MemoryCardSkeleton />
        </div>
      </div>
    )
  }

  const hasMemories = data?.pages?.[0]?.memories?.length ?? 0 > 0

  return (
    <div className='w-full py-6 mx-auto'>
      <MemoryLaneHeader
        onSortChange={handleSortChange}
        onMemoryCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['memories'] })
        }}
      />
      {!hasMemories ? (
        <EmptyState />
      ) : (
        <div className='flex flex-col items-center space-y-4'>
          {data?.pages.map((page, pageIndex) =>
            page.memories.map((memory, index) => {
              const globalIndex = pageIndex * 5 + index
              return (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  index={globalIndex}
                  onMemoryUpdated={() => {
                    queryClient.invalidateQueries({ queryKey: ['memories'] })
                  }}
                />
              )
            })
          )}

          {(isFetchingNextPage || hasNextPage) && (
            <div ref={ref} className='w-full py-4'>
              <MemoryCardSkeleton />
            </div>
          )}
        </div>
      )}
      <CreateMemoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMemoryCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['memories'] })
          setIsCreateModalOpen(false)
        }}
      />
    </div>
  )
}
