export interface SubjectMeta {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

export interface TaskMeta {
  id: string
  subjectId: string
  title: string
  difficulty: 1 | 2 | 3
  order: number
}

export interface Subject {
  meta: SubjectMeta
  theory: string
  tasks: Task[]
}

export interface Task {
  meta: TaskMeta
  description: string
  template: string
  testFiles: Record<string, string>
}

export interface ExecuteRequest {
  subjectId: string
  taskId: string
  code: string
  language: string
}

export interface ExecuteResult {
  passed: boolean
  output: string
  errors: string
  testResults: { name: string; passed: boolean; output: string }[]
}
