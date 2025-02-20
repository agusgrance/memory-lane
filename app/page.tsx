import { MemoryLane } from '@/components/MemoryLane'
import { Card, CardContent } from '@/components/ui/card'
import { CubeIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className='flex h-full'>
      <div className='fixed h-full p-4 shadow-lg w-fit'>
        <CubeIcon className='w-16 h-16' />
      </div>
      <div className='flex-1 py-12 overflow-y-auto px-36'>
        <h1 className='mt-4 mb-4 text-4xl font-semibold text-gray-900'>
          Agus's Memory lane
        </h1>
        <Card>
          <CardContent className='p-6'>
            <p className='leading-relaxed text-gray-700'>
              Jae Doe's journey has been a tapestry of curiosity and
              exploration. From a young age, their inquisitive mind led them
              through diverse interests. Education shaped their
              multidisciplinary perspective, while personal experiences added
              depth and resilience to their story. Embracing challenges and
              cherishing relationships, Jae continues to craft a unique and
              inspiring life history.
            </p>
          </CardContent>
        </Card>
        <MemoryLane />
      </div>
    </div>
  )
}
