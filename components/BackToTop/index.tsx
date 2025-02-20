'use client'
import { Button } from '@/components/ui/button'
import { ArrowUpIcon } from '@heroicons/react/24/outline'

import { motion, AnimatePresence } from 'framer-motion'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export const BackToTop = () => {
  const { isVisible, scrollToTop } = useScrollToTop()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className='fixed z-50 bottom-4 right-4'
        >
          <Button
            variant='outline'
            size='icon'
            onClick={scrollToTop}
            className='p-4 text-gray-900 rounded-full shadow-lg w-fit'
          >
            Back to Top
            <ArrowUpIcon className='w-5 h-5 text-gray-900' />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
