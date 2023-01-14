import React from 'react';
import { NERTable, SentimentTable, SimilarityTable } from '../server/trpc/router/tasks';
import HighlightedDocViewer from './HighlightedDocViewer';
type ValueOf<T> = T[keyof T];
export type NERTableItem = ValueOf<NERTable>;
export type SentimentTableItem = ValueOf<SentimentTable>;
export type SimilarityTableItem = ValueOf<SimilarityTable>;

interface TaskDataViewerProps{
    data: NERTableItem | SentimentTableItem | SimilarityTableItem,
    type: string,
    fileID: string
}

const TaskDataViewer: React.FC<TaskDataViewerProps> = ({data, type, fileID}) => {
    // console.log(data);
    // console.log(fileID);
  return type == "Similarity" 
  ?
  <div >
    <div className='w-full h-16 mt-2 flex flex-row items-center px-8 font-bold text-lg'>
        <span>{(data as SimilarityTableItem).name}</span>
    </div>
    <div>


    {
        Object.keys((data as SimilarityTableItem).similarities).map((i, ix)=>(
        <div className='w-full h-16 border-b border-gray-300 flex' key={ix}>
            <div className='w-6/12 h-full flex flex-row items-center px-8'>
                {(data as SimilarityTableItem).similarities[i as keyof object]!.name}
            </div>
            <div className='font-bold w-6/12 h-full flex flex-row items-center'>{(data as SimilarityTableItem).similarities[i as keyof object]!.score.toPrecision(2)}</div>
        </div>
        ))
    }
    </div>
  </div>
  :
  <HighlightedDocViewer type={type} fileID={fileID} data={type == "NER" ? data as NERTableItem : data as SentimentTableItem}/>

  
}

export default TaskDataViewer