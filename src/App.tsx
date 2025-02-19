import { CubeIcon } from '@heroicons/react/20/solid'
import './App.css'

function App() {
  return (
    <div>
      <div className='mx-auto mt-32 max-w-7xl sm:px-6 lg:px-8'>
        <div className='overflow-hidden bg-white rounded-lg shadow h-96'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <CubeIcon className='inline-block w-16 h-16' />
              <h1 className='mt-4 mb-4 ml-4 text-4xl font-semibold text-gray-900'>
                Memory lane
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
