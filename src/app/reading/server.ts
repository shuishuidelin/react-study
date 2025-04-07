/** 用来模拟后端接口，未来会用next的服务端去实现后端逻辑，目前存放到localStorage里，用promise去包装，后期方便替换成axios请求 */
/** 添加任务到 taskList */
import { setCacheItem, getCacheItem } from "@/utils/cacheUtil"
import { PreTask, Task, TaskList } from "./interfaces"

const TASKS_KEY = "tasks"
// 定义 任务步骤 键名前缀
const TASK_PROGRESS_KEY = "taskProgress_"
// 获取所有任务
export const getTasks = async (): Promise<TaskList> => {
  const tasks = getCacheItem<TaskList>(TASKS_KEY) || { tasks: [] }
  return tasks
}

// 获取单个任务
export const getTaskById = async (
  taskId: string,
): Promise<Task | undefined> => {
  const tasks = (await getTasks()).tasks
  return tasks.find((task) => task.id === taskId)
}
// 保存当前进度到 localStorage
export const recordTaskProgress = async (
  taskId: string,
  stepIndex: number,
): Promise<void> => {
  const task = await getTaskById(taskId)
  if (!task) throw new Error("Task not found")
  setCacheItem(`${TASK_PROGRESS_KEY}${taskId}`, stepIndex)
}
/* 从 localStorage 获取进度 */
export const loadProgress = async (
  taskId: string,
): Promise<number | undefined> => {
  const progress = getCacheItem<number>(`${TASK_PROGRESS_KEY}${taskId}`)
  return progress || 0
}

// 添加任务
export const addTask = async (task: PreTask): Promise<Task> => {
  if (task.id) throw new Error("Task ID already exists")
  task.id = Date.now().toString()
  const tasks = (await getTasks()).tasks
  const newTasks = [...tasks, task]
  setCacheItem(TASKS_KEY, { tasks: newTasks })
  return task as Task
}

// 更新任务
export const updateTask = async (
  taskId: string,
  updatedTask: Task,
): Promise<void> => {
  const tasks = (await getTasks()).tasks
  const newTasks = tasks.map((task) =>
    task.id === taskId ? updatedTask : task,
  )
  setCacheItem(TASKS_KEY, { tasks: newTasks })
}

// 删除任务
export const deleteTask = async (taskId: string): Promise<void> => {
  const tasks = (await getTasks()).tasks
  const newTasks = tasks.filter((task) => task.id !== taskId)
  setCacheItem(TASKS_KEY, { tasks: newTasks })
}
