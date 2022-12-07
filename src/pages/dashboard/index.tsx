import { GetServerSidePropsContext, NextPage } from 'next'
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { router } from '../../server/trpc/trpc';
import { trpc } from '../../utils/trpc'

const Dashboard: NextPage = () => {
    
    const collections = trpc.collections.getCollections.useQuery();
    const router = useRouter();
    return (
        <div className='w-full h-screen bg-gray-100 flex flex-col items-center'>
            <button onClick={()=>signOut()}className='absolute right-4 top-4 btn-primary'>Logout</button>
            <button onClick={()=>router.push("/upload")} className='absolute top-4 left-4 btn-primary'>New +</button>
            <div className='mt-24 w-10/12 lg:w-8/12 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {
                    collections && collections.data && collections.data.map((i, ix)=>(
                        <Link key={ix} href={`/dashboard/${i.id}`}>
                        <div className='w-11/12 h-32 mb-8 rounded-xl shadow-xl p-8 bg-white transition-all cursor-pointer flex flex-col'>
                            <span className='text-black font-medium text-2xl'>{i.name}</span>
                            <span className='text-sm'>Created {i.dateCreated.toLocaleDateString()}</span>
                            <span># Files</span>
                        </div>
                        </Link>
                    ))
                }
            </div>
           

        </div>
    )

  
}

export default Dashboard

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