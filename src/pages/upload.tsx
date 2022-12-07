import { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import { getServerAuthSession } from '../server/common/get-server-auth-session';

const Upload:NextPage = () => {
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.files);

        const out = await e.target.files![0]!.text()
        console.log(out)


    }
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
        <div className='w-8/12 h-5/6 rounded-xl bg-white'>
            <input type="file" name="" id="" onChange={handleFileUpload}/>
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