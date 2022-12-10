import { inferProcedureInput } from '@trpc/server';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { flushSync } from 'react-dom';
import { FileContainer } from '../pages/upload';
import { AppRouter } from '../server/trpc/router/_app';
import { trpc } from '../utils/trpc'
import TaskViewer from './TaskViewer';
interface TaskViewProps {
    collectionID: string,
    data: FileContainer[],
}
const TasksView: React.FC<TaskViewProps> = ({collectionID, data}) => {
    const [newTaskMenu, setNewTaskMenu] = useState<boolean>(false);
    const router = useRouter();
    const [taskType, setTaskType] = useState<string>("Sentiment");
    const [taskName, setTaskName] = useState("");
    const [selectedTask, setSelectedTask] = useState<number | null>(null);
    // console.log(router)

    const trpcContext = trpc.useContext();
    const tasks = trpc.tasks.getTasksForCollection.useQuery({collectionID: collectionID});
    const createTaskMutation = trpc.tasks.createTask.useMutation({
        onSuccess(res){
            console.log("RES:",res)
        }
    })

    const [selectedFiles, setSelectedFiles] = useState<boolean[]>(Array.from({length: data.length},(_, i)=>true ));
    useEffect(()=>{
        console.log(selectedFiles);

    },[selectedFiles])
    const sample= [{name: "Something",type:"NER", id: "asidas"}, {name: "Something2",type:"Sentiment", id: "asd"}, {name: "Something3",type:"Similarity", id: "uuid"},{name: "Something4",type:"NER", id: "asdiuh"} ]
    const handleCheck = (ix:number)=>{
        setSelectedFiles(prev=>{
            const copy = [...prev]
            copy[ix] = !prev[ix];
            return [...copy]
        })
    }

  const handleCreateTask = ()=>{
    let filesToInclude = [];
    for (let [ix, file] of data.entries()){
        if (selectedFiles[ix]){
            filesToInclude.push(file.id!);
        }
    }



    let out = {
        filesToInclude: filesToInclude,
        collectionID: collectionID,
        type: taskType,
        name: taskName
    } as inferProcedureInput<AppRouter["tasks"]["createTask"]>
    console.log(out);
    flushSync(()=>{
        setNewTaskMenu(false);

    });
    trpcContext.tasks.getTasksForCollection.setData({collectionID:collectionID}, (old)=>[...old!, {...out, id: "TBD"}]);
    

    createTaskMutation.mutateAsync(out);

  }  
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
        {newTaskMenu ?
            <div className='absolute w-10/12 h-5/6 bg-white rounded-lg border border-gray-300 flex flex-col'>
                <button className='w-12 h-12 text-3xl absolute right-4 top-4' onClick={()=>setNewTaskMenu(false)}>X</button>
                    <input value={taskName} onChange={(e)=>setTaskName(e.target.value)}className='m-8 w-72 h-12 bg-gray-100 rounded-md border border-gray-300 px-3' placeholder="Task Name"type="text" />
                <select onChange={(e)=>setTaskType(e.target.value)} className='mx-8 w-72 h-12 bg-gray-100 rounded-md border border-gray-300 px-2' name="" id="">
                    {Array(...["Sentiment", "NER", "Similarity"]).map((i,ix)=>(
                        <option key={ix}value={i}>{i}</option>
                    ))}
                </select>
                <div className='w-full px-6 mt-12 h-16 border-b-2 flex flex-row items-center'>
                    <div className='w-3/12 h-full flex flex-row items-center  font-semibold py-2'>
                        {/* <input onChange={(e)=>setSelectedFiles(Array.from({length: data.length}, (_, ix)=>e.target.checked))} className="w-4 h-4"type="checkbox" name="" id="" /> */}
                        <span className='ml-2'>Name</span>
                    </div>
                </div>
                <div>
                {
                    data.map((i,ix)=>(
                        <div key={ix} className='px-6 w-full h-16 border-b flex flex-row items-center'>
                            <input onChange={()=>handleCheck( ix)} checked={selectedFiles[ix]} className="w-4 h-4"type="checkbox" name="" id="" />
                            <div className='w-3/12 h-full flex flex-row items-center px-2'>
                                <span className='font-light'>
                                    {i.name}
                                </span>
                            </div>
                        </div>
                        )
                    )
                }
                </div>
                { taskName.length > 0 && selectedFiles.includes(true) && <button onClick={handleCreateTask} disabled={createTaskMutation.isLoading} className={`btn-primary  absolute bottom-4  flex flex-col items-center  justify-center right-4`}>Create</button>}
            </div> : selectedTask != null? 
            <>
                <div className='w-10/12 h-5/6'>
                    <TaskViewer setSelectedTask={setSelectedTask}/>
                </div>
            </>
            :
            <>
                <div className='w-10/12 flex justify-end mb-8'>
                    <button onClick={()=>setNewTaskMenu(true)}className='w-32 h-12 rounded-md bg-black text-white'>New Task</button>
                </div>
                <div className='w-10/12 h-4/6 flex flex-col rounded-lg bg-white border border-gray-300 shadow-xl'>
                    <div className='w-full h-16 bg-gray-50 border-b border-gray-300 rounded-t-xl flex flex-row'>
                        <div className='w-3/12 h-full flex flex-row items-center px-8'>
                            <span className='font-semibold'>Name</span>
                        </div>
                        <div className='w-3/12 h-full flex flex-row items-center px-8'>
                            <span className='font-semibold'>Task Type</span>
                        </div>
                        
                    </div>
                    <div className='w-full h-full overflow-y-scroll'>
                    {
                        tasks.data && tasks.data.map((i,ix)=>(
                            <div key={ix} onClick={()=>setSelectedTask(ix)} className='cursor-pointer hover:bg-gray-50 w-full h-16 border-b border-gray-300 flex flex-row items-center'>
                                <div className='w-3/12 h-full flex flex-row items-center px-8'>
                                    <span className=''>{i.name}</span>
                                </div>
                                <div className='w-3/12 h-full flex flex-row items-center px-8'>
                                    <span className='font-medium text-gray-500'>{i.type}</span>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    
                    </div>
            </>
        }
            


            
    </div>
  )
}

export default TasksView