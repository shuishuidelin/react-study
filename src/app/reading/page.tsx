"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Task } from "@/app/reading/interfaces"
import { getTasks } from "@/app/reading/server"
import { Button, Chip, Paper } from "@mui/material"

const ReadingPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const results = await getTasks()
        setTasks(results.tasks)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTask()
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
              <Paper
                elevation={3}
                style={{ padding: 16, marginBottom: 32 }}
                key={task.id}
                onClick={() => router.push(`/reading/${task.id}`)}
              >
                <Chip label={task.id}></Chip>
                {task.steps[0].original}
              </Paper>
            ))}
          </ul>
        </div>
      )}
      <div className="flex">
        <Button
          className={"flex-1 ml-2 mr-2"}
          variant={"contained"}
          color={"secondary"}
          onClick={() => router.push("/reading/addTask")}
        >
          Add Task
        </Button>
      </div>
    </div>
  )
}

export default ReadingPage
