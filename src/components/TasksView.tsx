import { inferProcedureInput } from '@trpc/server';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { toast } from 'react-toastify';
import { FileContainer } from '../pages/upload';
import { AppRouter } from '../server/trpc/router/_app';
import { trpc } from '../utils/trpc';
import TaskViewer from './TaskViewer';
import * as Paho from "paho-mqtt"
import { env } from '../env/client.mjs';
// import * as mqtt from "mqtt";

interface TaskViewProps {
    collectionID: string,
    data: FileContainer[],
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>;
}
const TasksView: React.FC<TaskViewProps> = ({collectionID, data, setDocInViewer}) => {
    const [newTaskMenu, setNewTaskMenu] = useState<boolean>(false);
    // const router = useRouter();
    const [taskType, setTaskType] = useState<string>("Sentiment");
    const [taskName, setTaskName] = useState("");
    const [selectedTask, setSelectedTask] = useState<number | null>(null);
    // console.log(router)
    const [client, setClient] = useState<Paho.Client>();
    useEffect(()=>{
        console.log(env.NEXT_PUBLIC_MQ_URL)
        const cl = new Paho.Client(env.NEXT_PUBLIC_MQ_URL, 15675, "/ws", "myclientid_" + String(Math.random() * 100));
        cl.onMessageArrived = (msg) => {
            const ob = JSON.parse(msg.payloadString);
            // console.log(msg.payloadString)
            if (ob["status"] == true){
                tasks.refetch();
            }
        }

        cl.connect({
            useSSL: true,
            reconnect: true,
            userName: env.NEXT_PUBLIC_MQ_USERNAME,
            password: env.NEXT_PUBLIC_MQ_PASSWORD,
            onSuccess: () => {
                // console.log("CONNEcTED");
                cl.subscribe(collectionID, {qos: 1});
            }
        });
 

    }, [])


    const trpcContext = trpc.useContext();
    const tasks = trpc.tasks.getTasksForCollection.useQuery({collectionID: collectionID});
    const checkForTask = trpc.tasks.checkForCollection.useMutation();
    const createTaskMutation = trpc.tasks.createTask.useMutation({
        onSuccess(res){
            // console.log("RES:",res)
            setTaskName("");

            // tasks.refetch();
        }
    })

    const [selectedFiles, setSelectedFiles] = useState<boolean[]>(Array.from({length: data.length},(_, i)=>true ));
    // useEffect(()=>{
    //     console.log(selectedFiles);

    // },[selectedFiles])
    const handleCheck = (ix:number)=>{
        setSelectedFiles(prev=>{
            const copy = [...prev]
            copy[ix] = !prev[ix];
            return [...copy];
        })
    }

  const handleCreateTask = async ()=>{



    const filesToInclude = [];
    for (const [ix, file] of data.entries()){
        if (selectedFiles[ix]){
            filesToInclude.push(file.id!);
        }
    }



    const out = {
        filesToInclude: filesToInclude,
        collectionID: collectionID,
        type: taskType,
        name: taskName
    } as inferProcedureInput<AppRouter["tasks"]["createTask"]>

    let hasError;
    
    const res = await checkForTask.mutateAsync({collectionID: collectionID, name: taskName}, {
        onError(err){
            console.log(err)
            toast.error(err.message);
            hasError = true;
            return;
        }
     }).catch((e)=>{
        // console.log(e);
     })
   

    if (hasError){
        // console.log("ERRRP:",checkForTask.error)
        return;
    } else {

        flushSync(()=>{
            setNewTaskMenu(false);
        })
    }
    
    trpcContext.tasks.getTasksForCollection.setData({collectionID:collectionID}, (old)=>[...old!, {...out, id: "TBD", type: taskType, collectionID: collectionID, similarities: null, name: taskName, taskData:null, filesToInclude: []}]);
      createTaskMutation.mutate(out, {
          onError(err) {
              toast.error(err.message);
          },
 
      });
  };
  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation({
    onSuccess(){
        tasks.refetch();
    }
  });
  const handleDeleteTask = (e: React.MouseEvent<HTMLButtonElement>, id: string)=>{
    e.stopPropagation();
    deleteTaskMutation.mutate({id: id})
  };

  


  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
        {newTaskMenu ?
            <div className='absolute w-10/12 h-5/6 bg-white rounded-lg border border-gray-300 flex flex-col'>
                <button className='w-12 h-12 text-3xl absolute right-4 top-4' onClick={()=>{setNewTaskMenu(false);setTaskName("")}}>X</button>
                    <input value={taskName} onChange={(e)=>setTaskName(e.target.value)}className='m-8 w-72 h-12 bg-gray-100 rounded-md border border-gray-300 px-3' placeholder="Task Name"type="text" />
                <select value={taskType} onChange={(e)=>setTaskType(e.target.value)} className='mx-8 w-72 h-12 bg-gray-100 rounded-md border border-gray-300 px-2' name="" id="">
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
                <div className='overflow-y-auto'>
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
                    {selectedTask !=null && <TaskViewer setDocInViewer={setDocInViewer} data={tasks.data![selectedTask]!} setSelectedTask={setSelectedTask}/>}
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
                    <div className='w-full h-full overflow-y-auto'>
                    {
                        tasks.data && tasks.data.map((i,ix)=>(
                            <div key={ix} onClick={()=>i.taskData && setSelectedTask(ix)} className={`h-16 ${i.taskData ? "cursor-pointer" : "cursor-not-allowed"} hover:bg-gray-50 w-full h-16 border-b border-gray-300 flex flex-row items-center`}>
                                <div className='w-3/12 h-full flex flex-row items-center px-8'>
                                    <span className=''>{i.name}</span>
                                </div>
                                <div className='w-3/12 h-full flex flex-row items-center px-8'>
                                    <span className='font-medium text-gray-500'>{i.type}</span>
                                </div>
                                <div className='w-3/12 ml-auto h-full flex flex-row justify-center items-center px-8'>
                                    
                                {createTaskMutation.isLoading || (!i.taskData) ? <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg> : <button onClick={(e)=>handleDeleteTask(e, i.id)} className='text-pink-500 w-32 font-semibold'>Delete</button>}
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