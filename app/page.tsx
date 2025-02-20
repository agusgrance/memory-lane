'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { MemoryLane } from '@/components/MemoryLane'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { EditProfileModal } from '@/components/EditProfileModal'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import {
  CubeIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getCurrent(),
  })

  const queryClient = useQueryClient()

  const handleShare = async () => {
    if (!user) return

    try {
      await navigator.share({
        title: `${user.name}'s Memory Lane`,
        text: user.description,
        url: window.location.href,
      })
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className='flex flex-col h-full md:flex-row'>
      <div className='sticky top-0 z-10 flex justify-center w-full p-4 bg-white border-b shadow-lg md:border-b-0 md:border-r md:w-fit md:h-full md:fixed'>
        <CubeIcon className='w-12 h-12 md:w-16 md:h-16' />
      </div>
      <div className='flex-1 p-4 overflow-y-auto md:py-12 md:px-8 lg:px-36 md:ml-24'>
        {isLoading ? (
          <>
            <div className='flex items-center justify-between mb-4'>
              <Skeleton className='w-64 h-10' />
              <Skeleton className='w-10 h-10' />
            </div>
            <Card>
              <CardContent className='p-6'>
                <Skeleton className='w-full h-24' />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className='flex flex-col justify-between gap-4 mb-4 md:flex-row md:items-center md:gap-0'>
              <h1 className='text-3xl font-semibold text-gray-900 md:text-4xl'>
                {user?.name}'s Memory lane
              </h1>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleShare}
                  className='w-10 h-10'
                >
                  <ShareIcon className='w-5 h-5' />
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className='p-6 pb-0'>
                <p className='leading-relaxed text-gray-700'>
                  {user?.description}
                </p>
                <CardFooter className='flex justify-end pb-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='w-8 h-8'>
                        <EllipsisHorizontalIcon className='w-5 h-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </CardContent>
            </Card>
            {user && (
              <EditProfileModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onProfileUpdated={() => {
                  queryClient.invalidateQueries({ queryKey: ['user'] })
                }}
              />
            )}
          </>
        )}
        <MemoryLane />
      </div>
    </div>
  )
}
