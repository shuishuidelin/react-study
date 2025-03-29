"use client"
import { useState, useEffect } from "react"

interface TaskStep {
  id: string
  original: string
  translation: string
}

interface Task {
  id: string
  steps: TaskStep[]
}

const TaskDetailPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [userInput, setUserInput] = useState("")

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedCurrentTaskIndex = localStorage.getItem("currentTaskIndex")
    const savedCurrentStepIndex = localStorage.getItem("currentStepIndex")
    const savedUserInput = localStorage.getItem("userInput")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedCurrentTaskIndex !== null) {
      setCurrentTaskIndex(parseInt(savedCurrentTaskIndex, 10))
    }
    if (savedCurrentStepIndex !== null) {
      setCurrentStepIndex(parseInt(savedCurrentStepIndex, 10))
    }
    if (savedUserInput) {
      setUserInput(savedUserInput)
    }
  }, [])

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    setUserInput(input)
    localStorage.setItem("userInput", input)
  }

  const checkAnswer = () => {
    const currentTask = tasks[currentTaskIndex]
    const currentStep = currentTask.steps[currentStepIndex]
    if (userInput.trim() === currentStep.translation) {
      if (currentStepIndex < currentTask.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
        setUserInput("")
        localStorage.setItem("currentStepIndex", (currentStepIndex + 1).toString())
        localStorage.setItem("userInput", "")
      } else if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1)
        setCurrentStepIndex(0)
        setUserInput("")
        localStorage.setItem("currentTaskIndex", (currentTaskIndex + 1).toString())
        localStorage.setItem("currentStepIndex", "0")
        localStorage.setItem("userInput", "")
      } else {
        alert("All tasks completed!")
        setTasks([])
        setCurrentTaskIndex(0)
        setCurrentStepIndex(0)
        setUserInput("")
        localStorage.removeItem("tasks")
        localStorage.removeItem("currentTaskIndex")
        localStorage.removeItem("currentStepIndex")
        localStorage.removeItem("userInput")
      }
    } else {
      alert("Incorrect. Try again.")
    }
  }

  return (
    <div>
      <h1>Task Details</h1>
      {tasks.length > 0 && (
        <div>
          <h2>
            Task {currentTaskIndex + 1} of {tasks.length}, Step {currentStepIndex + 1} of {tasks[currentTaskIndex].steps.length}
          </h2>
          <p>Original: {tasks[currentTaskIndex].steps[currentStepIndex].original}</p>
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Enter translation"
          />
          <button onClick={checkAnswer}>Submit</button>
        </div>
      )}
    </div>
  )
}

export default TaskDetailPage