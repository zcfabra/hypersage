import React, { useState } from 'react'
import { FileContainer } from '../pages/upload'
import { trpc } from '../utils/trpc';

interface SearchViewProps{
    collectionID: string,
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>,
    // triggerRefetch: () => void,
    data: FileContainer[]
}

const SearchView: React.FC<SearchViewProps> = ({data, collectionID, setDocInViewer}) => {
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
        <div className='relative w-10/12 h-5/6 rounded-xl bg-white border border-gray-300 flex flex-col items-center py-16'>
            <div className='h-16 w-10/12'>
                <input value={query} onKeyDown={handleEnterKeySubmit} onChange={(e)=>setQuery(e.target.value)} placeholder="Search something..."className="outline-none w-10/12 h-16 rounded-l-md bg-gray-100 shadow-inner border border-gray-300  px-4"type="text" />
                <button className='w-2/12 bg-pink-500 h-full rounded-r-md text-white' onClick={handleExecuteSearch}>Search</button>
            </div>

            <div className='w-10/12 mt-8 flex flex-col items-center'>
                {found.data && found.data.map((i,ix)=>(
                    <div key={ix} onClick={()=>setDocInViewer(i.id)} className='w-full px-4 cursor-pointer h-16 border-b border-gray-300 flex flex-row items-center'>
                        <span>{i.name}</span>
                    </div>
                ))}
            </div>
            {/* <button onClick={()=>setTasks} className='absolute bottom-4 right-4 btn-primary'>Send to Tasks</button> */}
        </div>
    </div>
  )
}

export default SearchView