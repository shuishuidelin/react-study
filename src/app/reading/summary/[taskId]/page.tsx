// src/pages/reading/summary.tsx
"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Task } from "@/app/reading/interfaces"
import { getTaskById } from "@/app/reading/server"
import { Button } from "@mui/material"

const SummaryPage = () => {
  const { taskId } = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId as string)
        if (fetchedTask) {
          setTask(fetchedTask)
        } else {
          setError("Task not found")
        }
      } catch (err) {
        setError("Failed to fetch task")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [taskId])
  const handleRestart = () => {}
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }
  return (
    <div>
      <h1>Summary</h1>
      {task.steps.length > 0 ? (
        <ul>
          {task.steps.map((step, index) => (
            <li key={index}>
              <div key={step.id}>
                <p>Original: {step.original}</p>
                <p>Translation: {step.translation}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}
      <div className="flex justify-around pl-2 pr-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/reading")}
        >
          Back to Reading
        </Button>
        {/* 清空进度重来 */}
        <Button variant="contained" color="primary" onClick={handleRestart}>
          Restart
        </Button>
      </div>
    </div>
  )
}

export default SummaryPage
