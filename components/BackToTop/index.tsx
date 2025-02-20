'use client'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

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
