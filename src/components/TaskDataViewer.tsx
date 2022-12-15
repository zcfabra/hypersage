import { File } from '@prisma/client';
import React from 'react'
import { NERTable, SentimentTable, SimilarityTable } from '../server/trpc/router/tasks'
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
    console.log(data);
    console.log(fileID);
  return type == "Similarity" 
  ?
  <div></div>
  :
  <HighlightedDocViewer type={type} fileID={fileID} data={type == "NER" ? data as NERTableItem : data as SentimentTableItem}/>

  
}

export default TaskDataViewer