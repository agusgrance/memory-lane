import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Memory, memoryService } from '@/services/api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { UploadDropzone } from '@/utils/uploadthing'

interface CreateMemoryModalProps {
  isOpen: boolean
  onClose: () => void
  onMemoryCreated: () => void
}

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onMemoryCreated,
}) => {
  const [memory, setMemory] = useState<Partial<Memory>>({
    name: '',
    description: '',
    timestamp: new Date().toISOString().split('T')[0],
    image: '',
  })
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await memoryService.create(memory as Memory)
      onMemoryCreated()
      onClose()
      toast.success('Memory created successfully!')
    } catch (error) {
      toast.error('Error creating memory')
      console.error('Error creating memory:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Title</label>
            <input
              type='text'
              value={memory.name}
              onChange={(e) => setMemory({ ...memory, name: e.target.value })}
              className='w-full p-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Description</label>
            <textarea
              value={memory.description}
              onChange={(e) =>
                setMemory({ ...memory, description: e.target.value })
              }
              className='w-full p-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Date</label>
            <input
              type='date'
              value={memory.timestamp}
              onChange={(e) =>
                setMemory({ ...memory, timestamp: e.target.value })
              }
              className='w-full p-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Image</label>
            <div className='mt-2'>
              <UploadDropzone
                endpoint='imageUploader'
                onUploadBegin={(res) => {
                  console.log('res', res)

                  setIsUploading(true)
                  setPreviewUrl('')
                }}
                onClientUploadComplete={(res) => {
                  console.log('res', res)
                  if (res?.[0]?.url) {
                    setMemory({ ...memory, image: res[0].url })
                    setPreviewUrl(res[0].url)
                    setIsUploading(false)
                    toast.success('Image uploaded successfully!')
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false)
                  setPreviewUrl('')
                  toast.error(`Upload failed: ${error.message}`)
                  console.error('Upload error:', error)
                }}
              />
              {isUploading && (
                <div className='flex items-center gap-2 mt-2 text-sm text-gray-500'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Uploading image...
                </div>
              )}
              {previewUrl && (
                <div className='relative w-full h-40 mt-4 overflow-hidden rounded-md'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='object-cover w-full h-full'
                  />
                </div>
              )}
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isUploading}>
              Create Memory
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
