import { motion } from 'framer-motion'

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className='flex flex-col items-center justify-center w-full p-8 text-center'
    >
      <h3 className='mb-2 text-xl font-semibold text-gray-900'>
        No memories yet
      </h3>
      <p className='max-w-sm mb-6 text-gray-500'>
        Start creating your memory collection by adding your first memory. Each
        memory tells a unique part of your story.
      </p>
    </motion.div>
  )
}
