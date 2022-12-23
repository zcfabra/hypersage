import { File } from '@prisma/client'
import React, { useState } from 'react'
import { FileContainer } from '../pages/upload'
import { trpc } from '../utils/trpc'
import FileTable from './FileTable'
import UploadEngine from './UploadEngine'

interface FilesViewProps{
    collectionID: string,
    data: (File)[],
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>,
    triggerRefetch: () => void,
}

const FilesView: React.FC<FilesViewProps> = ({collectionID, data, setDocInViewer, triggerRefetch}) => {
    const [showAddFilesMenu, setShowAddFilesMenu] = useState<boolean>(false);
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
        <div className=' w-11/12 sm:w-10/12 h-5/6 text-sm'>
            <FileTable truncate={true} allowDelete={true} data={data} displaySize={true} displayType={true} headless={false} setDocInViewer={setDocInViewer} triggerRefetch={triggerRefetch}/>
        </div>
    </div>
  )
}

export default FilesView