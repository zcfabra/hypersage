import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { getServerAuthSession } from '../../../server/common/get-server-auth-session'
import { trpc } from '../../../utils/trpc'
import {TbSearch as Search, TbFileAnalytics as Files, TbChartInfographic as Visualize} from "react-icons/tb"
import {BsLightningCharge as Tasks} from "react-icons/bs"
import FilesView from '../../../components/FilesView'
import { FileContainer } from '../../upload'
import DocViewer from '../../../components/DocViewer'
import SearchView from '../../../components/SearchView'

import TasksView from '../../../components/TasksView'


const Collection: NextPage = () => {
  const router = useRouter();
  console.log(router);
  const [tab, setTab] = useState<string>(router.query.selected ? router.query.selected as string : "Files");
  console.log(router.query.id);
  const [docInViewer, setDocInViewer] = useState<string| null>(null);

  const MENU = ["Files", "Search", "Tasks", "Visualize"];
  const iconMap = {
    "Files": <Files/>,
    "Search": <Search/>,
    "Tasks": <Tasks/>,
    "Visualize": <Visualize/>
  }

  const {data, refetch} = trpc.collections.getCollection.useQuery({id: router.query.id as string}, {enabled: router.isReady})
  const triggerRefetch = ()=>{
    console.log("REFETCH")
    refetch();
  }
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-row'>{data ? (<>
    { docInViewer && <DocViewer setDocInViewer={setDocInViewer} doc={docInViewer}/>}
      <div className='w-2/12 h-full bg-white shadow-xl flex flex-col'>
        <span className='m-4 text-2xl font-semibold'>{data.name}</span>
        <div className='mt-12 w-full h-5/6'>
          {MENU.map((i, ix)=>(
            <div key={ix} onClick={()=>setTab(i)} className={`w-full ${i == tab && "bg-pink-400 text-white"} h-16 p-4 cursor-pointer hover:bg-pink-400 hover:text-white transition-all flex flex-row items-center`}>
              {iconMap[i as keyof object]}
              <span className='ml-4'>{i}</span>
              
            </div>
          ))}
        </div>
      </div>
      <div className='relative w-10/12 h-full'>
        <button onClick={()=>router.push("/dashboard")} className='absolute top-4 text-gray-500 hover:underline font-medium left-4'>Back</button>
      {(() => {
                switch (tab) {
                  case "Files":
                    return <FilesView collectionID={data.id} triggerRefetch={triggerRefetch}setDocInViewer={setDocInViewer} data={data.files}/>;
                  case "Search":
                    return <SearchView collectionID={data.id} data={data.files}setDocInViewer={setDocInViewer} triggerRefetch={triggerRefetch} />;
                  case "Tasks":
                    return <TasksView collectionID={data.id} data={data.files}/>
                }
            })()}
      </div>

      </>): "Loading..."}</div>
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