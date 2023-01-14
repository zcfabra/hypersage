import { Task } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import TaskDataViewer, { NERTableItem, SentimentTableItem, SimilarityTableItem } from './TaskDataViewer';

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
    const [showTaskDataForFile, setShowTaskDataForFile] = useState<string | null>();
    // useEffect(()=>{
    //     console.log("DATTA: ",data)
    // },[])
  return (
    <div className='w-full h-full bg-white rounded-lg border border-gray-300 flex flex-col'>
        <div className='w-full h-16 shrink-0 bg-gray-50 border-b rounded-t-lg border-gray-300 flex flex-row px-8'>
              <button className='text-gray-500' onClick={() => showTaskDataForFile == null ? setSelectedTask(null) : setShowTaskDataForFile(null)}>&#60; Back</button>

        </div>
        <div className='w-full h-full flex-1 rounded-b-xl overflow-y-auto '>
           {showTaskDataForFile==null ? data.filesToInclude.map((i,ix)=>(
            <div key={ix}onClick={()=>setShowTaskDataForFile(i.file.id)} className='w-full h-16 border-b border-gray-300 flex flex-row'>
                <div className='w-4/12 h-full flex flex-row items-center px-8 truncate'>
                    <span>{i.file.name}</span>
                </div>
                <div className='w-4/12 h-full text-gray-500 flex flex-row items-center p-8 overflow-hidden'>
                    <span>{data.type == "NER"
                    ?
                    (data.taskData![i.file.id as keyof object] as NERTableItem).data.length
                    :
                    data.type == "Sentiment"
                    ?
                    String((data.taskData![i.file.id as keyof object] as SentimentTableItem).score.toPrecision(2)) + " " + (data.taskData![i.file.id as keyof object] as SentimentTableItem).sentiment
                    :
                    data.type == "Similarity" &&
                    "Most: " + (data.taskData![i.file.id as keyof object] as SimilarityTableItem).mostSimilar.name
                    }</span>
                </div>
                {data.type == "Similarity" && <div className='w-4/12 h-full text-gray-500 flex flex-row items-center p-8 overflow-hidden '>
                    <span>Least: {(data.taskData![i.file.id as keyof object] as SimilarityTableItem).leastSimilar.name}</span>
                </div>}
            </div>
           )) : <TaskDataViewer fileID={showTaskDataForFile} type={data.type} data={data.taskData![showTaskDataForFile as keyof object]}/>}
        </div>
    </div>
  )
}

export default TaskViewer