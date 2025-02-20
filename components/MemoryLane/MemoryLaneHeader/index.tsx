import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateMemoryModal } from '@/components/CreateMemoryModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MemoryLaneHeaderProps {
  onSortChange: (value: string) => void
  onMemoryCreated: () => void
}

export const MemoryLaneHeader = ({
  onSortChange,
  onMemoryCreated,
}: MemoryLaneHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className='flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row sm:gap-0'>
        <Select defaultValue='older' onValueChange={onSortChange}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='older'>Older to new</SelectItem>
            <SelectItem value='newer'>New to old</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsModalOpen(true)}
          className='w-full text-gray-900 bg-white border border-gray-900 sm:w-auto hover:bg-gray-900 hover:text-white'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='w-4 h-4 mr-2'
          >
            <path d='M5 12h14' />
            <path d='M12 5v14' />
          </svg>
          New memory
        </Button>
      </div>
      <CreateMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMemoryCreated={onMemoryCreated}
      />
    </>
  )
}
