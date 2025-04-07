export interface TaskStep {
  id: string
  original: string
  translation: string
}

export interface PreTask {
  id?: string
  steps: TaskStep[]
}

export interface Task {
  id: string
  steps: TaskStep[]
}

export interface TaskList {
  tasks: Task[]
}
