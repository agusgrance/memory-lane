'use client'

import { useEffect, useState, useMemo } from 'react'
import { MemoryCard } from '@/components/MemoryCard'
import { MemoryLaneHeader } from './MemoryLaneHeader'
import { MemoriesResponse, memoryService } from '@/services/api'
import { MemoryCardSkeleton } from '@/components/MemoryCard/MemoryCardSkeleton'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { EmptyState } from '@/components/EmptyState'
import { CreateMemoryModal } from '@/components/CreateMemoryModal'

const MemoryLaneSkeleton = () => (
  <div className='space-y-4 animate-pulse'>
    <div className='flex justify-between'>
      <div className='w-32 h-10 bg-gray-200 rounded' />
      <div className='w-24 h-10 bg-gray-200 rounded' />
    </div>
    <div className='flex flex-col items-center justify-center gap-4'>
      {[1, 2, 3].map((i) => (
        <MemoryCardSkeleton key={i} />
      ))}
    </div>
  </div>
)

export const MemoryLane: React.FC = () => {
  const queryClient = useQueryClient()
  const [sortOrder, setSortOrder] = useState<'older' | 'newer'>('older')
  const { ref, inView } = useInView()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const queryConfig = useMemo(
    () => ({
      queryKey: ['memories', sortOrder],
      queryFn: ({ pageParam = 1 }) =>
        memoryService.getAll(pageParam, sortOrder),
      getNextPageParam: (
        lastPage: MemoriesResponse,
        pages: MemoriesResponse[]
      ) => (lastPage.hasMore ? pages.length + 1 : undefined),
      initialPageParam: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }),
    [sortOrder]
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(queryConfig)

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
        <MemoryLaneSkeleton />
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
