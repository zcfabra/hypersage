import React from 'react'

interface TaskViewerProps{
    setSelectedTask: React.Dispatch<React.SetStateAction<number|null>>
}

const TaskViewer: React.FC<TaskViewerProps> = ({setSelectedTask}) => {
  return (
    <div className='w-full h-full bg-white rounded-lg border border-gray-300'>
        <div className='w-full h-16 bg-gray-50 border-b rounded-t-lg border-gray-300 flex flex-row px-8'>
            <button className='text-gray-500' onClick={()=>setSelectedTask(null)}>Back</button>
        </div>
    </div>
  )
}

export default TaskViewer