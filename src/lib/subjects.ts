import fs from "fs"
import path from "path"
import type { SubjectMeta, TaskMeta, Subject, Task } from "@/types"

const SUBJECTS_DIR = path.join(process.cwd(), "subjects")

function readFileSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return ""
  }
}

function readJsonSafe<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T
  } catch {
    return null
  }
}

export function getSubjectIds(): string[] {
  try {
    return fs.readdirSync(SUBJECTS_DIR).filter((name) => {
      const stat = fs.statSync(path.join(SUBJECTS_DIR, name))
      return stat.isDirectory() && !name.startsWith(".")
    })
  } catch {
    return []
  }
}

export function getSubjectMeta(subjectId: string): SubjectMeta | null {
  const metaPath = path.join(SUBJECTS_DIR, subjectId, "meta.json")
  return readJsonSafe<SubjectMeta>(metaPath)
}

export function getSubjectTheory(subjectId: string): string {
  const theoryDir = path.join(SUBJECTS_DIR, subjectId, "theory")
  if (fs.existsSync(theoryDir)) {
    try {
      return fs
        .readdirSync(theoryDir)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((f) => readFileSafe(path.join(theoryDir, f)))
        .join("\n\n---\n\n")
    } catch {
      return ""
    }
  }
  const theoryPath = path.join(SUBJECTS_DIR, subjectId, "theory.md")
  return readFileSafe(theoryPath)
}

export function getSubjectTasks(subjectId: string): TaskMeta[] {
  const tasksDir = path.join(SUBJECTS_DIR, subjectId, "tasks")
  try {
    return fs
      .readdirSync(tasksDir)
      .filter((name) => {
        const stat = fs.statSync(path.join(tasksDir, name))
        return stat.isDirectory() && !name.startsWith(".")
      })
      .map((name) => {
        const meta = readJsonSafe<TaskMeta>(
          path.join(tasksDir, name, "meta.json")
        )
        return {
          id: name,
          subjectId,
          title: meta?.title ?? name,
          difficulty: meta?.difficulty ?? 1,
          order: meta?.order ?? 0,
        }
      })
      .sort((a, b) => a.order - b.order)
  } catch {
    return []
  }
}

export function getTask(
  subjectId: string,
  taskId: string
): Task | null {
  const metaDir = path.join(SUBJECTS_DIR, subjectId, "tasks", taskId)
  const meta = readJsonSafe<TaskMeta>(path.join(metaDir, "meta.json"))
  if (!meta) return null

  const description = readFileSafe(path.join(metaDir, "task.md"))
  const template = readFileSafe(path.join(metaDir, "template.txt"))

  const testFiles: Record<string, string> = {}
  try {
    const files = fs.readdirSync(metaDir)
    for (const file of files) {
      if (file.startsWith("test.") || file.startsWith("tests.")) {
        testFiles[file] = readFileSafe(path.join(metaDir, file))
      }
    }
  } catch {
    // no test files
  }

  return {
    meta: { ...meta, id: taskId, subjectId },
    description,
    template,
    testFiles,
  }
}

export function getAllSubjects(): Subject[] {
  return getSubjectIds()
    .map((id) => {
      const meta = getSubjectMeta(id)
      const theory = getSubjectTheory(id)
      const tasks = getSubjectTasks(id)
      if (!meta) return null
      return {
        meta: { ...meta, id },
        theory,
        tasks: tasks.map((t) => ({
          meta: t,
          description: "",
          template: "",
          testFiles: {},
        })),
      } as Subject
    })
    .filter((s): s is Subject => s !== null)
    .sort((a, b) => a.meta.order - b.meta.order)
}
