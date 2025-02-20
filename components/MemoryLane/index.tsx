'use client'

import { useEffect, useState } from 'react'
import { MemoryCard } from '../Card'
import { MemoryLaneHeader } from './MemoryLaneHeader'
import { Memory, memoryService } from '@/services/api'

export const MemoryLane: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  const [sortOrder, setSortOrder] = useState<'older' | 'newer'>('older')

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      const data = await memoryService.getAll()
      setMemories(data)
    } catch (error) {
      console.error('Error loading memories:', error)
    }
  }

  const sortedMemories = [...memories].sort((a, b) => {
    const comparison =
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    return sortOrder === 'older' ? comparison : -comparison
  })

  const handleSortChange = (value: string) => {
    setSortOrder(value as 'older' | 'newer')
  }

  return (
    <div className='w-full py-6 mx-auto'>
      <MemoryLaneHeader
        onSortChange={handleSortChange}
        onMemoryCreated={loadMemories}
      />
      <div className='flex flex-col items-center space-y-4'>
        {sortedMemories.map((memory) => (
          <MemoryCard
            key={memory.id}
            title={memory.name}
            description={memory.description}
            date={new Date(memory.timestamp).toLocaleDateString()}
            image={memory.image}
          />
        ))}
      </div>
    </div>
  )
}
