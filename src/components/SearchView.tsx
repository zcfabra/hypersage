import { File } from '@prisma/client';
import React, { useState } from 'react'


import { trpc } from '../utils/trpc';
import FileTable from './FileTable';

interface SearchViewProps{
    collectionID: string,
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>,
    triggerRefetch: () => void,
    data: File[]
}

const SearchView: React.FC<SearchViewProps> = ({data, collectionID, setDocInViewer, triggerRefetch}) => {
    const [query, setQuery] = useState<string>("");
    const found = trpc.collections.fullTextSearchInCollection.useQuery({collectionID: collectionID, query: query}, {
        initialData: data ,
        enabled: false,
        onSuccess(res){
            console.log("HI",res);
        }
    })
    const handleExecuteSearch = () =>{
        found.refetch();
    }

    const handleEnterKeySubmit = (e: React.KeyboardEvent<HTMLInputElement>)=>{

        if (e.key == "Enter"){

            handleExecuteSearch();
        }
    }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
        <div className='relative w-10/12 h-5/6 rounded-xl bg-white border border-gray-300 flex flex-col items-center '>
            <div className='h-36 w-full flex justify-center items-center border-b px-8'>
                <input value={query} onKeyDown={handleEnterKeySubmit} onChange={(e)=>setQuery(e.target.value)} placeholder="Search..."className="outline-none w-8/12 sm:w-10/12 h-12 rounded-l-md bg-gray-100 shadow-inner border border-gray-300  px-4"type="text" />
                <button className='w-4/12 sm:w-2/12 bg-pink-500 h-12 rounded-r-md text-white' onClick={handleExecuteSearch}>Search</button>
            </div>

                <div className='w-full flex-1 h-full  flex flex-col items-center overflow-y-auto'>
                {found.data && <FileTable truncate={false} allowDelete={false} data={found.data} displaySize={false} displayType={false} headless={true}  setDocInViewer={setDocInViewer} triggerRefetch={triggerRefetch}/> }
                </div>
            {/* <button onClick={()=>setTasks} className='absolute bottom-4 right-4 btn-primary'>Send to Tasks</button> */}
        </div>
    </div>
  )
}

export default SearchView