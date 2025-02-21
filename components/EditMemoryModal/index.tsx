import { useState, useEffect } from 'react'
import Image from 'next/image'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/utils/uploadthing'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { Memory, memoryService } from '@/services/api'
import { Loader2 } from 'lucide-react'

interface EditMemoryModalProps {
  memory: Memory
  isOpen: boolean
  onClose: () => void
  onMemoryUpdated: () => void
}

const schema = yup
  .object({
    name: yup
      .string()
      .max(50, 'Title must be at most 50 characters')
      .required('Title is required'),
    description: yup
      .string()
      .max(140, 'Description must be at most 140 characters')
      .required('Description is required'),
    timestamp: yup.string().required('Date is required'),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onMemoryUpdated,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(
    memory.image || '/cactus.jpg'
  )
  const [isUploading, setIsUploading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: memory.name,
      description: memory.description,
      timestamp: new Date(memory.timestamp).toISOString().split('T')[0],
    },
  })

  // Watch for form changes
  const watchedFields = watch()

  useEffect(() => {
    const hasFormChanges =
      watchedFields.name !== memory.name ||
      watchedFields.description !== memory.description ||
      watchedFields.timestamp !==
        new Date(memory.timestamp).toISOString().split('T')[0] ||
      imageUrl !== (memory.image || '/cactus.jpg')

    setHasChanges(hasFormChanges)
  }, [watchedFields, memory, imageUrl])

  useEffect(() => {
    if (isOpen) {
      setImageUrl(memory.image || '/cactus.jpg')
    }
  }, [memory.image, isOpen])

  const handleClose = () => {
    setImageUrl(memory.image || '/cactus.jpg')
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    try {
      await memoryService.update(memory.id!, {
        ...data,
        image: imageUrl,
      } as Memory)
      onMemoryUpdated()
      onClose()
      toast.success('Memory updated successfully!')
    } catch (error) {
      toast.error('Error updating memory')
      console.error('Error updating memory:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className='sm:max-w-md md:max-w-lg'
        aria-describedby='edit-memory-description'
      >
        <DialogHeader>
          <DialogTitle>Edit Memory</DialogTitle>
          <DialogDescription id='edit-memory-description'>
            Make changes to your memory below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Title</label>
            <input
              {...register('name')}
              className='w-full p-2 border rounded-md'
              maxLength={50}
            />
            <span className='text-sm text-gray-500'>{`${
              watch('name')?.length || 0
            }/50`}</span>
            {errors.name && (
              <span className='text-sm text-red-500'>
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label className='text-sm font-medium'>Description</label>
            <textarea
              {...register('description')}
              className='w-full p-2 border rounded-md'
              maxLength={140}
            />
            <span className='text-sm text-gray-500'>{`${
              watch('description')?.length || 0
            }/140`}</span>
            {errors.description && (
              <span className='text-sm text-red-500'>
                {errors.description.message}
              </span>
            )}
          </div>
          <div>
            <label className='text-sm font-medium'>Date</label>
            <input
              type='date'
              {...register('timestamp')}
              className='w-full p-2 border rounded-md'
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.timestamp && (
              <span className='text-sm text-red-500'>
                {errors.timestamp.message}
              </span>
            )}
          </div>
          <div className='relative'>
            <div className='relative w-full h-32 mt-4 overflow-hidden rounded-md sm:h-40'>
              <Image
                src={imageUrl}
                alt='Memory'
                fill
                className='object-cover'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw'
              />
              {isUploading && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                  <Loader2 className='w-6 h-6 text-white animate-spin' />
                </div>
              )}
            </div>
            <div className='mt-2'>
              <UploadButton
                endpoint='imageUploader'
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={(res) => {
                  setIsUploading(false)
                  setImageUrl(res?.[0]?.url || imageUrl)
                  toast.success('Image uploaded successfully!')
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false)
                  toast.error(`Error uploading image: ${error.message}`)
                }}
              />
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!hasChanges}>
              Update Memory
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
