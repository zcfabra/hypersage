import React, { useState } from 'react'
import { trpc } from '../utils/trpc'
interface TaskViewerProps {
    collectionID: string,
}
const TasksViewer: React.FC<TaskViewerProps> = ({collectionID}) => {
    const [newTaskMenu, setNewTaskMenu] = useState<boolean>(false);
    const tasks = trpc.tasks.getTasksForCollection.useQuery({collectionID: collectionID})
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
        {newTaskMenu ?
            <div className='absolute w-10/12 h-5/6 bg-white rounded-xl border border-gray-300'></div> :
            <>
                <button onClick={()=>setNewTaskMenu(true)}className='w-32 h-12 rounded-md bg-black text-white'>New Task</button>
                <div className='w-10/12 h-5/6 grid grid-cols-3'>
                    </div>
            </>
        }
            


            
    </div>
  )
}

export default TasksViewer