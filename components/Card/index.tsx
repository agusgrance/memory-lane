import React from 'react'
import Image from 'next/image'
import {
  Card as ShadCard,
  CardContent,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

interface MemoryCardProps {
  title: string
  description: string
  date: string
  image?: string
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  title,
  description,
  date,
  image = '/cactus.jpg', // imagen por defecto
}) => {
  return (
    <ShadCard className='w-full max-w-3xl'>
      <CardContent className='pt-6 pb-0'>
        <div className='flex gap-4'>
          <div className='flex-shrink-0 w-20 h-20 overflow-hidden rounded-full bg-neutral-100'>
            {image && (
              <Image
                src={image}
                alt={title}
                width={80}
                height={80}
                className='object-cover w-full h-full'
              />
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-start justify-between'>
              <div>
                <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
                <p className='mt-1 text-sm text-muted-foreground'>{date}</p>
              </div>
            </div>
            <p className='mt-2 text-muted-foreground'>{description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end pb-2'>
        <Button variant='ghost' size='icon' className='w-8 h-8'>
          <EllipsisHorizontalIcon className='w-5 h-5' />
        </Button>
      </CardFooter>
    </ShadCard>
  )
}
