import React, { useState } from 'react'
import Image from 'next/image'

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { EditMemoryModal } from '@/components/EditMemoryModal'
import {
  Card as ShadCard,
  CardContent,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Memory, memoryService } from '@/services/api'

interface MemoryCardProps {
  memory: Memory
  onMemoryUpdated: () => void
  index: number
}

export const MemoryCard = ({
  memory,
  onMemoryUpdated,
  index,
}: MemoryCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleDelete = async () => {
    if (!memory.id) return

    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        const imageKey = memory.image?.split('/').pop()
        await memoryService.delete(memory.id, imageKey)
        onMemoryUpdated()
        toast.success('Memory deleted successfully!')
      } catch (error) {
        toast.error('Error deleting memory')
        console.error('Error deleting memory:', error)
      }
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
        }}
        className='flex items-center justify-center w-full'
      >
        <ShadCard className='w-full max-w-3xl'>
          <CardContent className='pt-6 pb-0'>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <div className='relative w-32 h-32 mx-auto overflow-hidden rounded-full sm:mx-0 sm:w-20 sm:h-20 bg-neutral-100'>
                {!isImageLoaded && (
                  <div className='w-full h-full bg-gray-200 rounded-full skeleton-loader' />
                )}
                <Image
                  src={memory.image || '/cactus.jpg'}
                  alt={memory.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 640px) 128px, 80px'
                  loading='lazy'
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
              <div className='flex-1 max-w-xl text-center sm:text-left'>
                <div className='flex flex-col items-center justify-between sm:flex-row sm:items-start'>
                  <div>
                    <CardTitle className='text-xl font-semibold'>
                      {memory.name}
                    </CardTitle>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {new Date(memory.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className='mt-2 overflow-auto break-words text-muted-foreground max-h-32'>
                  {memory.description}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-end pb-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='w-8 h-8'>
                  <EllipsisHorizontalIcon className='w-5 h-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className='text-red-500'
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </ShadCard>
      </motion.div>

      <EditMemoryModal
        memory={memory}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onMemoryUpdated={onMemoryUpdated}
      />
    </>
  )
}
