import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';


export interface FileContainer{
    name: string,
    size: number,
    text: string,
    type: string,
    id?: string,
}

const Upload:NextPage = () => {
    const router = useRouter();
    const [filesToUpload, setFilesToUpload] = useState<FileContainer[]>([]);
    const [collectionName, setCollectionName] = useState<string>("");
    const uploadMutation = trpc.collections.createCollection.useMutation({
        onError(err){
            console.log(err);
        },
        onSuccess(res){
            console.log(res);
            router.push("/dashboard")
        }
    })
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
    const handleFileUpload = ()=>{
        uploadMutation.mutate({name: collectionName, files: filesToUpload})
    }
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
        <button onClick={()=>router.push("/dashboard")} className='absolute top-4 left-4 text-black underline font-semibold'>Back</button>
        <div className='w-8/12 h-5/6 rounded-xl bg-white p-8'>
            <input className='w-9/12 h-12 bg-gray-100 rounded-md shadow-inner mb-8 px-4' placeholder='Collection Name' type="text" value={collectionName} onChange={(e)=>setCollectionName(e.target.value)}/>
            <input multiple type="file" name="file" id="" onChange={handleFileLoad}/>
            {filesToUpload.length != 0 && <button onClick={handleFileUpload}className='btn-primary'>Upload</button>}
        </div>


    </div>
  )
}

export default Upload;

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
    const amIAuthed = await getServerAuthSession(ctx)
    if (!amIAuthed?.user){
        return {
            redirect: {
                destination: "/login",
                permanent: true
            }
        }
    }
    return{props:{}}
}