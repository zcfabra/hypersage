
import React from 'react'
import { trpc } from '../utils/trpc'
import { NERTableItem, SentimentTableItem } from './TaskDataViewer'
interface HighlightedDocViewerProps{
    data: NERTableItem | SentimentTableItem,
    type:string,
    fileID: string
}
const tagColors = { 'ORG': "bg-blue-500", 'FAC': "bg-green-500", 'CARDINAL': "bg-red-500", 'DATE': "bg-lime-500", 'GPE': "bg-pink-400", 'PERSON': "bg-teal-400", 'MONEY': "bg-amber-400", 'PRODUCT': "bg-rose-300", 'TIME': "bg-blue-300", 'PERCENT': "bg-emerald-500", 'WORK_OF_ART': "bg-indigo-500", 'QUANTITY': "bg-fuchsia-300", 'NORP': "bg-slate-400", 'LOC': "bg-red-300", 'EVENT': "bg-lime-500", 'ORDINAL': "bg-purple-500", "LANGUAGE" : 'bg-violet-500' }
const sentColors = {"POS": "bg-green-300", "NEG": "bg-red-300"};

const escapeSpecials = (inp: string):string=>{
    return inp.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, (matched)=>"\\" + matched);
}


const HighlightedDocViewer:React.FC<HighlightedDocViewerProps> = ({fileID, data, type}) => {
    const fileWithText = trpc.collections.getTextOfFile.useQuery({id: fileID});
    let matches;
    if (type == "NER"){
        matches = new RegExp((data as NERTableItem).data.map((i,ix)=>escapeSpecials(i.text)).join("|"), "g");
    } else {
        matches = new RegExp((data as SentimentTableItem).neg_words.concat((data as SentimentTableItem).pos_words).join("|"), "g")
    }
    let map = new Map<string, string>()
    if (type == "NER"){
        map = new Map((data as NERTableItem).data.map((i,ix)=>([i.text, i.label])));
    } else {
        const concatted = (data as SentimentTableItem).pos_words.map((i)=>({text: i, sentiment: "POS"})).concat((data as SentimentTableItem).neg_words.map((i)=>({text: i, sentiment: "NEG"})))
        map = new Map(concatted.map((i)=>([i.text, i.sentiment])));
    }
    console.log (map)
  return <div className='w-full flex flex-col p-8'>
            {fileWithText && fileWithText.data && <span dangerouslySetInnerHTML={{__html: fileWithText.data.text!.replace(matches, (matched)=>{
                console.log(matched)
                if (matched.length == 0) {
                    return fileWithText.data.text!;
                }
                return type == "NER"
                ?
                `<span class='${tagColors[map.get(matched)! as keyof object]} whitespace-nowrap font-semibold rounded-md p-[1px]'>${matched}${map.get(matched) != undefined ?" "+ map.get(matched) : ""}</span>`
                :
                `<span class='${sentColors[map.get(matched)! as keyof object]} whitespace-nowrap font-semibold rounded-md p-[1px]'>${matched}</span>`
            })}}></span>}
        </div>
 
}

export default HighlightedDocViewer