import { Task } from '@prisma/client';
import { inferProcedureOutput } from '@trpc/server';
import React, { useEffect } from 'react'
import { AppRouter } from '../server/trpc/router/_app';

interface TaskViewerProps{
    setSelectedTask: React.Dispatch<React.SetStateAction<number|null>>;
    data: (Task & {
        filesToInclude: {
            file: {
                id: string;
                name: string;
            };
        }[];
    }),
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>
}

const TaskViewer: React.FC<TaskViewerProps> = ({setSelectedTask, setDocInViewer, data}) => {
    useEffect(()=>{
        console.log("DATTA: ",data)
    },[])
  return (
    <div className='w-full h-full bg-white rounded-lg border border-gray-300 flex flex-col'>
        <div className='w-full h-16 bg-gray-50 border-b rounded-t-lg border-gray-300 flex flex-row px-8'>
            <button className='text-gray-500' onClick={()=>setSelectedTask(null)}>Back</button>

        </div>
        <div className='w-full flex-1 rounded-b-xl '>
           {data.filesToInclude.map((i,ix)=>(
            <div onClick={()=>setDocInViewer(i.file.id)} className='w-full h-16 border-b border-gray-300 flex flex-row'>
                <div className='w-3/12 h-full flex flex-row items-center px-8'>
                    <span>{i.file.name}</span>
                </div>
                <div className='w-full h-full flex flex-row items-center px-8 overflow-hidden'>
                    <p>{JSON.stringify(data.taskData![i.file.id as keyof object])}</p>
                </div>
            </div>
           ))}
        </div>
    </div>
  )
}

export default TaskViewer