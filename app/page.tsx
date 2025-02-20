'use client'

import { useState } from 'react'
import { MemoryLane } from '@/components/MemoryLane'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  CubeIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { EditProfileModal } from '@/components/EditProfileModal'
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@/components/ui/dropdown-menu'

export default function Home() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getCurrent(),
  })

  const queryClient = useQueryClient()

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${user?.name}'s Memory Lane`,
        text: user?.description,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className='flex h-full'>
      <div className='fixed h-full p-4 shadow-lg w-fit'>
        <CubeIcon className='w-16 h-16' />
      </div>
      <div className='flex-1 py-12 overflow-y-auto px-36'>
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
            <div className='flex items-center justify-between mb-4'>
              <h1 className='text-4xl font-semibold text-gray-900'>
                {user?.name}'s Memory lane
              </h1>
              <div className='flex gap-2'>
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
