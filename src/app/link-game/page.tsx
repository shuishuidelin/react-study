"use client"
// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
import TextBrick from "@/app/link-game/TextBrick"
import { useEffect, useRef, useState } from "react"
import {
  BrickState,
  LinkGameDataStructure,
  WordInfo,
} from "@/app/link-game/typing"
import { useImmer } from "use-immer"
import { linkGameConfig } from "@/app/link-game/linkGameConfig"
import { Drawer } from "@mui/material"
import ResultDrawer from "@/app/link-game/ResultDrawer"

export default function LinkGame() {
  const [wordData, updateWordData] = useImmer<WordInfo[]>([])
  const linkGameData = useRef<LinkGameDataStructure[]>([])
  const dataState = useRef<"init" | "loading" | "complete">("init")
  const [resultBoxVis, setResultBoxVis] = useState<boolean>(false) // 结算弹窗
  const requestServerData = async () => {
    return new Promise<void>((resolve) => {
      dataState.current = "loading"
      setTimeout(() => {
        const jsonStr =
          '[{"id":"0","question":"你好","answer":"hello"},{"id":"1","question":"世界","answer":"world"},{"id":"2","question":"我","answer":"me"},{"id":"3","question":"你","answer":"you"},{"id":"4","question":"他","answer":"he"},{"id":"5","question":"她","answer":"she"},{"id":"6","question":"它","answer":"it"},{"id":"7","question":"是","answer":"is"},{"id":"8","question":"的","answer":"of"},{"id":"9","question":"和","answer":"and"},{"id":"10","question":"一个","answer":"a"},{"id":"11","question":"在","answer":"in"},{"id":"12","question":"有","answer":"have"},{"id":"13","question":"这个","answer":"this"},{"id":"14","question":"那个","answer":"that"},{"id":"15","question":"我们","answer":"we"},{"id":"16","question":"你们","answer":"you all"},{"id":"17","question":"他们","answer":"they"},{"id":"18","question":"她","answer":"her"},{"id":"19","question":"们","answer":"s"},{"id":"20","question":"我的","answer":"my"},{"id":"21","question":"你的","answer":"your"},{"id":"22","question":"我们的","answer":"our"},{"id":"23","question":"他们的","answer":"their"},{"id":"24","question":"这里","answer":"here"}]'
        linkGameData.current = JSON.parse(jsonStr)
        dataState.current = "complete"
        resolve()
      }, 1000)
    })
  }
  const getData = async () => {
    if (linkGameData.current.length === 0) {
      if (dataState.current === "complete") return setResultBoxVis(true)
      await requestServerData()
    }
    const config = await linkGameConfig()
    const pageSize = config.pageSize || 5
    const temp: LinkGameDataStructure[] = []
    linkGameData.current.splice(0, pageSize).forEach((item, idx) => {
      temp[idx] = { ...item }
      temp[pageSize + idx] = { ...item, id: item.id + "_answer" }
    })
    updateWordData(temp)
  }
  const submit = () => {
    console.log("结束，成功了,上传结果")
    setResultBoxVis(false)
  }
  /* 选中的块id，用作两个块的比较 */
  const [choseWordId, setChoseWordId] = useState<string | undefined>(undefined)
  /* 获取单词块的类型 */
  const getWordInfoType = (id: string) => {
    return id.includes("_answer") ? "answer" : "question"
  }
  /* 计算结果，比较两个不同类型的块，问题和答案对照正确则满足 */
  const computeResult = (id1: string, id2: string) => {
    if (id1 === id2) return false
    return id1.replace("_answer", "") === id2.replace("_answer", "")
  }
  /* 选择单词块 */
  const onChooseWord = (id: string) => {
    updateWordData((draft) => {
      let target = undefined as WordInfo | undefined
      let chooseWord = undefined as WordInfo | undefined
      draft.forEach((item) => {
        if (id === item.id) target = item
        else if (choseWordId === item.id) chooseWord = item
        else if (
          item.state &&
          [BrickState.success, BrickState.disabled].includes(item.state)
        )
          item.state = BrickState.disabled
        else item.state = BrickState.normal
      })
      if (
        target &&
        chooseWord &&
        choseWordId &&
        getWordInfoType(id) !== getWordInfoType(choseWordId)
      ) {
        const result = computeResult(id, choseWordId)
        target.state = chooseWord.state = result
          ? BrickState.success
          : BrickState.error
        if (target.state === BrickState.success)
          target.over = chooseWord.over = true
        setChoseWordId(undefined)
      } else if (target) {
        target.state =
          target.state === BrickState.choose
            ? BrickState.normal
            : BrickState.choose
        if (chooseWord) chooseWord.state = BrickState.normal
        setChoseWordId(
          target.state === BrickState.choose ? target.id : undefined,
        )
      }
    })
  }
  useEffect(() => {
    // 整页都已完成
    if (wordData.length && !wordData.some((i) => !i.over)) {
      getData()
    }
  }, [wordData])
  useEffect(() => {
    console.log("onReady")
    getData()
  }, [])
  return (
    <div className="p-3">
      <h1>Hello, Dashboard Page!</h1>
      <div className="flex justify-around">
        <div className="w-5/12 flex flex-col">
          {wordData.slice(0, wordData.length / 2).map((item) => {
            return (
              <TextBrick
                text={item.question}
                key={item.id}
                action={{ state: item.state }}
                onChoose={() => onChooseWord(item.id)}
              ></TextBrick>
            )
          })}
        </div>
        <div className="w-5/12 flex flex-col">
          {wordData.slice(wordData.length / 2).map((item) => {
            return (
              <TextBrick
                text={item.answer}
                key={item.id}
                action={{ state: item.state }}
                onChoose={() => onChooseWord(item.id)}
              ></TextBrick>
            )
          })}
        </div>
      </div>
      <Drawer
        anchor={"bottom"}
        open={resultBoxVis}
        onClose={() => setResultBoxVis(false)}
        ModalProps={{
          onClose: () => setResultBoxVis(true),
        }}
      >
        <ResultDrawer onSubmit={submit}></ResultDrawer>
      </Drawer>
    </div>
  )
}
