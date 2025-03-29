"use client"
import { useState, useEffect } from "react"
import { getCacheItem, setCacheItem } from "@/utils/cacheUtil"

interface TaskStep {
  id: string
  original: string
  translation: string
}

interface Task {
  id: string
  steps: TaskStep[]
}

const AddTaskPage = () => {
  const [inputText, setInputText] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (window) (window as any).getCacheItem = getCacheItem
    if (window) (window as any).setCacheItem = setCacheItem

    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    if (text.length <= 50 * 1024) {
      setInputText(text)
    }
  }

  // mock AI call
  const requestServerData = async () => {
    return new Promise<{
      sentences: {
        id: string
        original: string
        translation: string
      }[]
    }>((resolve) => {
      setTimeout(() => {
        const jsonStr = `[{"id":"1","original":"You go through the channels several times and find that once again there's nothing on TV that interests you. Not a problem! Just put on some running shoes and comfortable clothes and go for a run.","translation":"你翻了几遍频道，发现又一次没有你感兴趣的电视节目。没问题！只需穿上跑鞋和舒适的衣服，去跑步吧。"},{"id":"2","original":"One of the best things about the sport of running is that you don't need expensive equipment. All you need is a good pair of running shoes and a safe environment.","translation":"跑步运动最好的事情之一是你不需要昂贵的设备。你只需要一双好的跑鞋和一个安全的环境。"},{"id":"3","original":"But don't be fooled into thinking the sport of running is easy, It requires discipline and concentration.","translation":"但不要被误导认为跑步运动很容易，它需要纪律和专注。"},{"id":"4","original":"Running is good for you both physically and mentally. It strengthens your heart, lungs, and muscles. It makes you more aware of your body.","translation":"跑步对你的身体和心理都有好处。它增强你的心脏、肺和肌肉。它让你更加了解你的身体。"},{"id":"5","original":"Running also improves your body so that you don't get sick as easily. It can even help you to stay more focused in school because exercise helps you to think more clearly.","translation":"跑步还能改善你的身体，使你不那么容易生病。它甚至可以帮助你在学校更加专注，因为运动帮助你更清晰地思考。"},{"id":"6","original":"How do you get engaged in the sport if you don't know much about it? Most schools offer running programs. A simple internet search can help you find some in your area.","translation":"如果你对这项运动不太了解，你如何参与其中？大多数学校都提供跑步项目。一个简单的互联网搜索可以帮助你在你的地区找到一些。"},{"id":"7","original":"Then programs show you how running can offer competition or just be for fun. They also teach runners to set practical goals and take care of their bodies.","translation":"然后这些项目向你展示跑步如何可以提供竞争或只是为了乐趣。他们还教跑步者设定实际的目标并照顾他们的身体。"},{"id":"8","original":"Runners have great respect for each other because they know how difficult the sport can be. If you go to a race, you'll see people cheering for all the runners.","translation":"跑步者彼此之间非常尊重，因为他们知道这项运动有多难。如果你去参加比赛，你会看到人们为所有跑步者加油。"},{"id":"9","original":"Running isn't always about how fast you are or how far you're going. It's about getting out there and doing it.","translation":"跑步并不总是关于你有多快或你跑多远。它是关于出去并做它。"},{"id":"10","original":"Participation is more important than competition, and effort is recognized over talent.","translation":"参与比竞争更重要，努力比天赋更被认可。"},{"id":"11","original":"If you're looking for more than just a sport, running may be the perfect choice for you.","translation":"如果你在寻找的不仅仅是一项运动，跑步可能是你的完美选择。"}]`
        resolve({
          sentences: JSON.parse(jsonStr),
        })
      }, 200)
    })
  }

  const callAI = async (text: string) => {
    try {
      const data = await requestServerData()
      return data
    } catch (error) {
      console.error("Error calling AI:", error)
      return null
    }
  }

  const generateTasks = (data: any) => {
    const tasks = localStorage.getItem("tasks") || []

    const newTasks: Task[] = data.sentences.map(
      (sentence: any, index: number) => ({
        id: `task-${index}`,
        steps: [
          {
            id: `step-${index}`,
            original: sentence.original,
            translation: sentence.translation,
          },
        ],
      }),
    )
    setTasks(newTasks)
    localStorage.setItem("tasks", JSON.stringify(newTasks))
  }

  const handleAnalyze = async () => {
    const data = await callAI(inputText)
    if (data) {
      generateTasks(data)
    }
  }

  return (
    <div>
      <h1>Add Task</h1>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter English text here (max 50KB)"
        rows={10}
        cols={50}
      />
      <button onClick={handleAnalyze}>Analyze Text</button>
    </div>
  )
}

export default AddTaskPage
