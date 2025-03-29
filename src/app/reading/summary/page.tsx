// src/pages/reading/summary.tsx
"use client"
import { useState, useEffect } from "react"

const AddPage = () => {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  return (
    <div>
      <h1>Summary</h1>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task, index) => (
            <li key={task.id}>
              <h2>Task {index + 1}</h2>
              {task.steps.map((step, stepIndex) => (
                <div key={step.id}>
                  <p>Original: {step.original}</p>
                  <p>Translation: {step.translation}</p>
                </div>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  )
}

export default AddPage
