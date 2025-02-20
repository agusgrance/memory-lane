import { useState } from 'react'
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
import { Loader2, X } from 'lucide-react'

interface CreateMemoryModalProps {
  isOpen: boolean
  onClose: () => void
  onMemoryCreated: () => void
}

const schema = yup
  .object({
    name: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    timestamp: yup.string().required('Date is required'),
    image: yup.string().required('Image is required'),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onMemoryCreated,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      timestamp: new Date().toISOString().split('T')[0],
      image: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await memoryService.create(data as Memory)
      onMemoryCreated()
      reset()
      setPreviewUrl('')
      onClose()
      toast.success('Memory created successfully!')
    } catch (error) {
      toast.error('Error creating memory')
      console.error('Error creating memory:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-md md:max-w-lg'
        aria-describedby='memory-form-description'
      >
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
          <DialogDescription id='memory-form-description'>
            Fill in the details below to create a new memory. All fields are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Title</label>
            <input
              {...register('name')}
              className='w-full p-2 border rounded-md'
            />
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
            />
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
            />
            {errors.timestamp && (
              <span className='text-sm text-red-500'>
                {errors.timestamp.message}
              </span>
            )}
          </div>
          <div>
            <label className='text-sm font-medium'>Image</label>
            <p className='mb-2 text-sm text-gray-500'>
              Upload a single image (max 4MB)
            </p>
            <div className='mt-2'>
              {!previewUrl && (
                <UploadButton
                  endpoint='imageUploader'
                  onUploadBegin={() => {
                    setIsUploading(true)
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setPreviewUrl(res[0].url)
                      setValue('image', res[0].url, {
                        shouldValidate: true,
                      })
                      setIsUploading(false)
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setIsUploading(false)
                    setPreviewUrl('')
                    setValue('image', '', {
                      shouldValidate: true,
                    })
                    toast.error(`Upload failed: ${error.message}`)
                  }}
                />
              )}
              {errors.image && (
                <span className='block mt-1 text-sm text-red-500'>
                  {errors.image.message}
                </span>
              )}
              {isUploading && (
                <div className='flex items-center gap-2 mt-2 text-sm text-gray-500'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Processing image...
                </div>
              )}
              {previewUrl && (
                <div className='relative'>
                  <div className='relative w-full h-32 mt-4 overflow-hidden rounded-md sm:h-40'>
                    <Image
                      src={previewUrl}
                      alt='Preview'
                      fill
                      className='object-cover'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw'
                    />
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-2 right-2'
                    onClick={() => {
                      setPreviewUrl('')
                      setValue('image', '', {
                        shouldValidate: true,
                      })
                    }}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isUploading || !isValid}>
              Create Memory
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
