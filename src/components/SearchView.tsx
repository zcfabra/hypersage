import React from 'react'
import { FileContainer } from '../pages/upload'

interface SearchViewProps{
    collectionID: string,
    setDocInViewer: React.Dispatch<React.SetStateAction<string | null>>,
    // triggerRefetch: () => void,
    data: FileContainer[]
}

const SearchView: React.FC<SearchViewProps> = ({data, collectionID, setDocInViewer}) => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
        <div className='w-10/12 h-5/6 rounded-xl bg-white border border-gray-300 flex flex-col items-center py-16'>
            <input placeholder="Search something..."className="w-10/12 h-16 rounded-md bg-gray-100 shadow-inner border border-gray-300  px-4"type="text" />
            <div className='w-10/12  flex flex-col items-center'>
                {data.map((i,ix)=>(
                    <div key={ix} className='w-full px-4 h-16 border-b border-gray-300 flex flex-row items-center'>
                        <span>{i.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default SearchView