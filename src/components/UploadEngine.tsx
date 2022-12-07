import { UseMutateFunction } from '@tanstack/react-query';
import React, { useState } from 'react'
import { FileContainer } from '../pages/upload'

interface UploadEngineProps{
    passedMutation: (filesToUpload: FileContainer[]) => void,
}

const UploadEngine: React.FC<UploadEngineProps> = ({passedMutation}) => {
    const [filesToUpload, setFilesToUpload] = useState<FileContainer[]>([]);
    const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.files);
        let out = []

        if (e.target.files){

            for (let file of e.target.files){
                let extracted_text = await file.text();
                
                out.push({
                    name: file.name,
                    size: file.size,
                    text: extracted_text,
                    type: file.type
                } as FileContainer)
            }
        }

        console.log(out);
        setFilesToUpload(out);
    }
  return (
    <div className='w-full h-full flex flex-col'>
        <span>Upload</span>
        <input multiple type="file" onChange={handleFileLoad} />
        {filesToUpload.length > 0 && <button onClick={()=>passedMutation(filesToUpload)} className='btn-primary'>Upload</button> }

    </div>
  )
}

export default UploadEngine