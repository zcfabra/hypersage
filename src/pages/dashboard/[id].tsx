import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'
import { trpc } from '../../utils/trpc'

const Collection: NextPage = () => {
  const router = useRouter();
  console.log(router.query.id)

  const collection = trpc.collections.getCollection.useQuery({id: router.query.id as string}, {enabled: router.isReady})
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-row'>{collection.data ? (
      <span className='text-6xl font-semibold'>{collection.data.name}</span>

    ): "Loading..."}</div>
    )
}

export default Collection;

export async function getServerSideProps(ctx: GetServerSidePropsContext){
  const amIAuthed = await getServerAuthSession(ctx);
  if (!amIAuthed?.user || !amIAuthed){
    return {
      redirect:{
        destination: "/login",
        permanent:true,
      }
    }
  } else {
    return {
      props:{}
    }
  }
}