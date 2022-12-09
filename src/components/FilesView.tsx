import React, { useState } from 'react'
import { FileContainer } from '../pages/upload'
import { trpc } from '../utils/trpc'
import UploadEngine from './UploadEngine'

interface FilesViewProps{
    collectionID: string,
    data: (FileContainer)[],
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>,
    triggerRefetch: () => void,
}

const FilesView: React.FC<FilesViewProps> = ({collectionID, data, setDocInViewer, triggerRefetch}) => {
    const [showAddFilesMenu, setShowAddFilesMenu] = useState<boolean>(false);

    const deleteMutation = trpc.collections.deleteFileFromCollection.useMutation({
        onSuccess(){
            triggerRefetch();
        }

    });

    const addFilesMutation = trpc.collections.addFilesToCollection.useMutation({
        onSuccess(){
            setShowAddFilesMenu(false);
            triggerRefetch();
        },
        onError(err){
            console.log(err)
        }
    });

    const handleAddFilesMutate = (filesToUpload: FileContainer[])=>{
        addFilesMutation.mutate({
            id: collectionID,
            files: filesToUpload
        });
    }
    const triggerDeleteMutation = (e: React.MouseEvent<HTMLButtonElement>, id: string)=>{
        e.stopPropagation();
        deleteMutation.mutate({id: id})
    }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
        {showAddFilesMenu && (
            <div className='absolute w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
                <button onClick={()=>setShowAddFilesMenu(false)} className=' absolute w-12 h-12 top-4 right-4 text-3xl'>X</button>
                <div className='w-10/12 h-4/6 rounded-xl bg-white border shadow-xl p-8 flex flex-col'>
                   <UploadEngine passedMutation={handleAddFilesMutate}/>
                </div>

            </div>
        )}
        <div className='w-10/12 h-12 mb-8 flex flex-row justify-end items-center'>
            <button onClick={()=>setShowAddFilesMenu(true)} className='btn-primary'>Add Files</button>

        </div>
        <div className='w-10/12 h-4/6 rounded-lg overflow-y-scroll bg-white flex-col border border-gray-300 shadow-lg'>
                <div className='w-full h-16 bg-gray-50 border-b border-gray-300 flex flex-row'>
                    <div className='w-3/12 h-full flex flex-row items-center px-8'>
                        <span className='text-black font-semibold'>Name</span>
                    </div>
                    <div className='w-3/12 h-full flex flex-row items-center px-8'>
                        <span className='text-black font-semibold'>Type</span>
                    </div>
                    <div className='w-3/12 h-full flex flex-row items-center px-8'>
                        <span className='text-black font-semibold'>Size</span>
                    </div>
                </div>
                {data.map((i, ix)=>(
                        <div key={ix} onClick={()=>setDocInViewer(i.id!)} className='w-full h-16 hover:bg-gray-50 cursor-pointer flex flex-row border-b'>
                            <div className='w-3/12 flex flex-row items-center  px-8'>
                                {i.name}
                            </div>
                            <div className='w-3/12 flex flex-row items-center text-gray-500 px-8'>
                                {i.type}
                            </div>
                            <div className='w-3/12 flex flex-row items-center text-gray-500 px-8'>
                                {i.size >= 1000 ? Math.round(i.size / 1000) + "kb" : i.size + "b"}
                            </div>
                            <div className='w-3/12 flex flex-row items-center text-gray-500  px-8'>
                                <button onClick={(e)=>triggerDeleteMutation(e, i.id!)} className='ml-auto w-32 h-12 text-pink-500 hover:underline font-semibold'>Delete</button>
                            </div>
                        </div>
                    ))}
            
            
        </div>
    </div>
  )
}

export default FilesView