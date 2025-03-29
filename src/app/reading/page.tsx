"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
interface TaskStep {
  id: string
  original: string
  translation: string
}

interface Task {
  id: string
  steps: TaskStep[]
}

const ReadingPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Router.push("/reading/addTask")
    }
  }, [])

  return (
    <div>
      <h1>Reading Practice</h1>
      {tasks.length === 0 ? (
        <p>No tasks available. Please add a new task.</p>
      ) : (
        <div>
          <h2>Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>{task.steps[0].original}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => router.push("/reading/addTask")}>Add Task</button>
    </div>
  )
}

export default ReadingPage
