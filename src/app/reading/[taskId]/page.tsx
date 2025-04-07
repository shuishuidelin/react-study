"use client"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  getTaskById,
  loadProgress,
  recordTaskProgress,
} from "@/app/reading/server"
import { Task, TaskStep } from "@/app/reading/interfaces"
import { Typography, Box, Button, Paper, Chip, Grid2 } from "@mui/material"
import BorderLinearProgress from "@/components/BorderLinearProgress"
import { randomKeyword } from "@/utils/tools"
const TaskDetailPage = () => {
  const { taskId } = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [translationChunks, setTranslationChunks] = useState<string[]>([])
  const [usedChunks, setUsedChunks] = useState<string[]>([])
  const currentCorrectChunks = useRef<string[]>([])

  /*封装函数处理步骤，切割字符和赋值到对应的对象*/
  const genCurrentStep = (step: TaskStep) => {
    const chunks = step.translation
      .split(/\s|,|，|。/)
      .filter((chunk) => chunk.trim() !== "")
    currentCorrectChunks.current = [...chunks]
    setTranslationChunks(randomKeyword(chunks, chunks.length))
    setUsedChunks([])
  }

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId as string)
        if (fetchedTask) {
          setTask(fetchedTask)
          // 加载保存的进度
          const savedStepIndex = await loadProgress(taskId as string)
          if (savedStepIndex && savedStepIndex >= fetchedTask.steps.length) {
            return router.push(`/reading/summary/${taskId}`)
          }
          const validStepIndex = Math.min(
            savedStepIndex || 0,
            fetchedTask.steps.length - 1,
          )
          setCurrentStepIndex(validStepIndex)
          genCurrentStep(fetchedTask.steps[validStepIndex])
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  const currentStep = task.steps[currentStepIndex]

  const handleChunkClick = (chunk: string) => {
    setTranslationChunks((prevChunks) => prevChunks.filter((c) => c !== chunk))
    setUsedChunks((prevUsedChunks) => [...prevUsedChunks, chunk])
  }
  /* 点击取消选中的chunk */
  const handleChunkUnClick = (chunk: string) => {
    setTranslationChunks((prevChunks) => [...prevChunks, chunk])
    setUsedChunks((prevUsedChunks) => prevUsedChunks.filter((c) => c !== chunk))
  }

  const handleNextStep = () => {
    // 先校验答案是否正确，不正确则提示错误，正确提示正确
    if (
      currentCorrectChunks.current.length !== usedChunks.length ||
      currentCorrectChunks.current.some((chunk) => !usedChunks.includes(chunk))
    ) {
      alert("答案错误，请重新输入" + currentCorrectChunks.current.join(","))
      return
    }
    if (currentStepIndex < task.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      genCurrentStep(task.steps[currentStepIndex + 1])
      recordTaskProgress(task.id, currentStepIndex + 1)
    }
    if (currentStepIndex === task.steps.length - 1) {
      recordTaskProgress(task.id, currentStepIndex + 1)
      alert("恭喜你，任务已完成")
      // next 跳转到总结
      router.push(`/reading/summary/${taskId}`)
    }
  }

  return (
    <div>
      <h1>Task Details</h1>
      <h2>Task ID: {task.id}</h2>

      {/* Progress Bar */}
      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <BorderLinearProgress
          variant="determinate"
          value={(currentStepIndex / task.steps.length) * 100}
        />
        <Typography variant="body2" color="text.secondary">
          Step {currentStepIndex + 1} of {task.steps.length}
        </Typography>
      </Box>

      {/* Original Text */}
      <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6">Original Text</Typography>
        <Typography variant="body1">{currentStep.original}</Typography>
      </Paper>
      {/* Translated Text Area */}
      <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6">Translated Text</Typography>
        <div className="p-4 border border-gray-300 rounded-md">
          <Grid2 container spacing={1}>
            {usedChunks.map((chunk, index) => (
              <Chip
                key={index}
                label={chunk}
                onClick={() => handleChunkUnClick(chunk)}
                style={{ cursor: "pointer", margin: 2 }}
              />
            ))}
          </Grid2>
        </div>
      </Paper>
      {/* Translation Chunks */}
      <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6">Translation Chunks</Typography>
        <Grid2 container spacing={1}>
          {translationChunks.map((chunk, index) => (
            <Chip
              key={index}
              label={chunk}
              onClick={() => handleChunkClick(chunk)}
              style={{ cursor: "pointer", margin: 2 }}
            />
          ))}
        </Grid2>
      </Paper>

      {/* submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleNextStep}
        disabled={usedChunks.length === 0}
      >
        Next Step
      </Button>
      {/*<Button variant="contained" color="secondary" onClick={handleReset}>*/}
      {/*  Reset*/}
      {/*</Button>*/}
    </div>
  )
}

export default TaskDetailPage
