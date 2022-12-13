import { Task } from '@prisma/client';
import { inferProcedureOutput } from '@trpc/server';
import React, { useEffect } from 'react'
import { AppRouter } from '../server/trpc/router/_app';

interface TaskViewerProps{
    setSelectedTask: React.Dispatch<React.SetStateAction<number|null>>;
    data: Task,
}

const TaskViewer: React.FC<TaskViewerProps> = ({setSelectedTask, data}) => {
    useEffect(()=>{
        console.log("DATTA: ",data)
    },[])
  return (
    <div className='w-full h-full bg-white rounded-lg border border-gray-300'>
        <div className='w-full h-16 bg-gray-50 border-b rounded-t-lg border-gray-300 flex flex-row px-8'>
            <button className='text-gray-500' onClick={()=>setSelectedTask(null)}>Back</button>

            <pre>{data.name}</pre>
        </div>
    </div>
  )
}

export default TaskViewer