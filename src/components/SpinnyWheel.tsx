import React from 'react'

const SpinnyWheel = () => {
  return (
    <svg className='animate-spin h-6 w-6 text-white' viewBox='0 0 24 24'>
                        <circle className='opacity-25 fill-transparent stroke-gray-200 stroke-2' cx="12" cy="12" r="10"></circle>
                        <path className='fill-pink-400' d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
            
  )
}

export default SpinnyWheel