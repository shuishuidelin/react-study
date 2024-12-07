'use client';
// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
import TextBrick from "@/app/link-game/TextBrick";
import {useEffect, useState} from "react";
import {BrickState, WordInfo} from "@/app/link-game/typing";

export default function LinkGame() {
    const [wordData,setWordData] = useState<WordInfo[]>([]);
    const getData = ()=>{
        const jsonData = [
            {id:'0',question:'你好',answer:'hello'},
            {id:'1',question:'世界',answer:'world'},
            {id:'2',question:'我',answer:'me'},
            {id:'3',question:'你',answer:'you'},
        ]
        const temp:typeof jsonData= []
        jsonData.forEach((item,idx)=>{
            temp[idx] = {...item}
            temp[jsonData.length + idx] = {...item,id:item.id+'a'}
        })
        setWordData(temp)
    }
    const onChooseWord = (idx: number)=>{
        const newWordData = [...wordData];
        if(newWordData[idx].state === BrickState.choose){
            newWordData[idx].state = BrickState.normal
        }else {
            newWordData[idx].state = BrickState.choose;
        }
        setWordData(newWordData)
    }
    useEffect(()=>{
        console.log('onReady')
        getData()
    },[])
    return (<div className="p-3">
        <h1>Hello, Dashboard Page!</h1>
        <div className="flex justify-around">
            <div className="w-5/12 flex flex-col">
                {wordData.slice(0,wordData.length/2).map((item,idx) =>{
                    return (<TextBrick text={item.question} key={item.id} action={{state:item.state}} onChoose={()=>onChooseWord(idx)}></TextBrick>)
                })}
            </div>
            <div className="w-5/12 flex flex-col">
                {wordData.slice(wordData.length/2).map((item,idx) =>{
                    return (<TextBrick text={item.answer} key={item.id}  action={{state:item.state}}  onChoose={()=>onChooseWord(wordData.length/2 + idx)}></TextBrick>)
                })}
            </div>
        </div>

    </div>)
}