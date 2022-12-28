import { Task } from '@prisma/client'
import React from 'react'
import { trpc } from '../utils/trpc'

interface DocViewerProps{
    doc: string,
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>,
    taskData?: Task
}

const DocViewer: React.FC<DocViewerProps> = ({doc, setDocInViewer}) => {
    const fileWithText = trpc.collections.getTextOfFile.useQuery({id: doc});
  return (
    <div className='absolute z-20 w-full h-full backdrop-blur-sm'>
    <div className='w-full h-full bg-black flex flex-col bg-opacity-30 items-center justify-center'>
      <div className='relative w-10/12 h-5/6 opacity-100 bg-white rounded-xl shadow-xl border'>
        <button onClick={()=>setDocInViewer(null)} className='w-12 h-12 absolute top-4 right-4 text-3xl'>X</button>
        
        {fileWithText.data && (
            <div className='w-full  h-full p-8 flex flex-col'>
                <span className='font-bold text-3xl mb-8'>{fileWithText.data.name}</span>
                <div className='w-full overflow-y-auto h-full flex-1'>
                    <p>{fileWithText.data.text}</p>
                </div>
                

            </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default DocViewer