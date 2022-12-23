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

  const MENU = ["Files",
  "Search",
  "Tasks",
  // "Visualize"
];
  const iconMap = {
    "Files": <Files/>,
    "Search": <Search/>,
    "Tasks": <Tasks/>,
    // "Visualize": <Visualize/>
  }

  const {data, refetch} = trpc.collections.getCollection.useQuery({id: router.query.id as string}, {enabled: router.isReady})
  const triggerRefetch = ()=>{
    console.log("REFETCH")
    refetch();
  }
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col sm:flex-row overflow-y-hidden'>{data ? (<>
    { docInViewer && <DocViewer setDocInViewer={setDocInViewer} doc={docInViewer}/>}
      <div className='sm:w-2/12 w-full  h-16  sm:h-full  shadow-xl flex sm:flex-col items-center'>
        <span className='flex pl-4 w-3/12 sm:h-16 h-full sm:w-full text-md sm:text-2xl font-semibold items-center'>{data.name}</span>
        <div className='sm:mt-12 w-9/12 sm:w-full flex-1 h-full flex sm:flex-col'>
          {MENU.map((i, ix)=>(
            <div key={ix} onClick={()=>setTab(i)} className={`w-4/12 sm:w-full ${i == tab && "bg-pink-400 text-white"} h-16 sm:h-16 sm:p-4 cursor-pointer hover:bg-pink-400 hover:text-white transition-all flex flex-row items-center`}>
              <span className='ml-2 sm:ml-0 h-full flex items-center'>
                {iconMap[i as keyof object]}
                </span>
              <span className=' ml-2 sm:ml-4'>{i}</span>
              
            </div>
          ))}
        </div>
      </div>
      <div className='relative w-full flex-1 h-full sm:w-10/12'>
        <button onClick={() => router.push("/dashboard")} className='absolute top-4 text-gray-500 hover:underline font-medium left-4'>&#60; Home</button>
      {(() => {
                switch (tab) {
                  case "Files":
                    return <FilesView collectionID={data.id} triggerRefetch={triggerRefetch}setDocInViewer={setDocInViewer} data={data.files}/>;
                  case "Search":
                    return <SearchView collectionID={data.id} data={data.files}setDocInViewer={setDocInViewer} triggerRefetch={triggerRefetch} />;
                  case "Tasks":
                    return <TasksView collectionID={data.id} setDocInViewer={setDocInViewer}data={data.files}/>
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