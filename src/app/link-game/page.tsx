"use client";
// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
import TextBrick from "@/app/link-game/TextBrick";
import { useEffect, useState } from "react";
import { BrickState, WordInfo } from "@/app/link-game/typing";
import { useImmer } from "use-immer";

export default function LinkGame() {
  const [wordData, updateWordData] = useImmer<WordInfo[]>([]);
  const getData = () => {
    const jsonData = [
      { id: "0", question: "你好", answer: "hello" },
      { id: "1", question: "世界", answer: "world" },
      { id: "2", question: "我", answer: "me" },
      { id: "3", question: "你", answer: "you" },
    ];
    const temp: typeof jsonData = [];
    jsonData.forEach((item, idx) => {
      temp[idx] = { ...item };
      temp[jsonData.length + idx] = { ...item, id: item.id + "_answer" };
    });
    updateWordData(temp);
  };
  const submit = () => {
    console.log("结束，成功了");
  };
  /* 选中的块id，用作两个块的比较 */
  const [choseWordId, setChoseWordId] = useState<string | undefined>(undefined);
  /* 获取单词块的类型 */
  const getWordInfoType = (id: string) => {
    return id.includes("_answer") ? "answer" : "question";
  };
  /* 计算结果，比较两个不同类型的块，问题和答案对照正确则满足 */
  const computeResult = (id1: string, id2: string) => {
    if (id1 === id2) return false;
    return id1.replace("_answer", "") === id2.replace("_answer", "");
  };
  /* 选择单词块 */
  const onChooseWord = (id: string) => {
    updateWordData((draft) => {
      let target = undefined as WordInfo | undefined;
      let chooseWord = undefined as WordInfo | undefined;
      draft.forEach((item) => {
        if (id === item.id) target = item;
        else if (choseWordId === item.id) chooseWord = item;
        else if (
          item.state &&
          [BrickState.success, BrickState.disabled].includes(item.state)
        )
          item.state = BrickState.disabled;
        else item.state = BrickState.normal;
      });
      if (
        target &&
        chooseWord &&
        choseWordId &&
        getWordInfoType(id) !== getWordInfoType(choseWordId)
      ) {
        const result = computeResult(id, choseWordId);
        target.state = chooseWord.state = result
          ? BrickState.success
          : BrickState.error;
        if (target.state === BrickState.success)
          target.over = chooseWord.over = true;
        setChoseWordId(undefined);
      } else if (target) {
        target.state =
          target.state === BrickState.choose
            ? BrickState.normal
            : BrickState.choose;
        if (chooseWord) chooseWord.state = BrickState.normal;
        setChoseWordId(
          target.state === BrickState.choose ? target.id : undefined,
        );
      }
    });
  };
  useEffect(() => {
    if (wordData.length && !wordData.some((i) => !i.over)) submit();
  }, [wordData]);
  useEffect(() => {
    console.log("onReady");
    getData();
  }, []);
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
            );
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
