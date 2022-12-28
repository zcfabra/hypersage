import { File } from '@prisma/client'
import React from 'react'
import { trpc } from '../utils/trpc'

interface FileTableProps{
    data: (File)[],
    displayType: boolean,
    displaySize: boolean,
    allowDelete: boolean,
    setDocInViewer: React.Dispatch<React.SetStateAction<string|null>>,
    headless: boolean,
    triggerRefetch: ()=>void,
    truncate: boolean,

}


/*
    As long as you wrap this component in a div (for sizing), it should work fine
 */
const FileTable: React.FC<FileTableProps> = ({data, displaySize, displayType, setDocInViewer, allowDelete, triggerRefetch, headless, truncate}) => {
    const deleteMutation = trpc.collections.deleteFileFromCollection.useMutation({
        onSuccess(){
            triggerRefetch();
        }

    });
    const triggerDeleteMutation = (e: React.MouseEvent<HTMLButtonElement>, id: string)=>{
        e.stopPropagation();
        deleteMutation.mutate({id: id})
    }
  return (
    <div className={`w-full h-full flex flex-col ${!headless && "rounded-lg bg-white border border-gray-300"} `}>
                {!headless && 
                <div className='w-full bg-gray-50 border-b border-gray-300 rounded-t-lg h-16 flex flex-row'>
                    <div className='w-3/12 text-semibold h-16 flex flex-row items-center px-8'>Name</div>
                    <div className='w-3/12 text-semibold h-16 flex flex-row items-center px-8'>Type</div>
                    <div className='w-3/12 text-semibold h-16 flex flex-row items-center px-8'>Size</div>
                </div>}
                <div className='w-full h-full flex-1 overflow-y-auto'>
                    {data.map((i, ix)=>(
                            <div key={ix} onClick={()=>setDocInViewer(i.id!)} className='w-full h-16 hover:bg-gray-50 cursor-pointer flex flex-row border-t'>
                                <div className={`w-3/12 flex flex-row items-center  px-8 ${truncate && "truncate"}`}>
                                    {i.name}
                                </div>
                                {displayType && (<div className={`w-3/12 flex flex-row items-center text-gray-500 px-8 ${truncate && "truncate"}`}>
                                    {i.type}
                                </div>)}
                                {displaySize && (<div className={`w-3/12 flex flex-row items-center text-gray-500 px-8 ${truncate && "truncate"}`}>
                                    {i.size >= 1000 ? Math.round(i.size / 1000) + "kb" : i.size + "b"}
                                </div>)}
                            {allowDelete && ( <div className='w-3/12 flex flex-row items-center text-gray-500  px-8'>
                                    <button onClick={(e)=>triggerDeleteMutation(e, i.id!)} className='ml-auto w-32 h-12 text-pink-500 hover:underline font-semibold'>Delete</button>
                                </div>)}
                            </div>
                        ))}
                </div>
            </div>
  )
}

export default FileTable