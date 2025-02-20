import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User, userService } from '@/services/api'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onProfileUpdated: () => void
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
})

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [hasChanges, setHasChanges] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      description: user.description,
    },
  })

  // Watch for form changes
  const watchedFields = watch()

  useEffect(() => {
    const hasFormChanges =
      watchedFields.name !== user.name ||
      watchedFields.description !== user.description

    setHasChanges(hasFormChanges)
  }, [watchedFields, user])

  const onSubmit = async (data: Partial<User>) => {
    try {
      await userService.update(data)
      onProfileUpdated()
      onClose()
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Error updating profile')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Name</label>
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
              rows={4}
            />
            {errors.description && (
              <span className='text-sm text-red-500'>
                {errors.description.message}
              </span>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!hasChanges || !isValid}>
              Update Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
