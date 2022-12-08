import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import UploadEngine from '../components/UploadEngine';
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
 
    const handleFileUpload = (filesToUpload: FileContainer[])=>{
        uploadMutation.mutate({name: collectionName, files: filesToUpload})
    }
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
        <button onClick={()=>router.push("/dashboard")} className='absolute top-4 left-4 text-black underline font-semibold'>Back</button>
        <div className='w-8/12 h-5/6 rounded-xl bg-white p-8'>
            <input className='w-9/12 h-12 bg-gray-100 shadow-inner rounded-md px-4 text-black' placeholder='Collection Name' type="text" value={collectionName} onChange={(e)=>setCollectionName(e.target.value)}/>
           <UploadEngine passedMutation={handleFileUpload}/>
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