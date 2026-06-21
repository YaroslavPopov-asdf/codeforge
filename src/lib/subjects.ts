import fs from "fs"
import path from "path"
import type { LanguageMeta, SubjectMeta, TaskMeta, Subject, Task } from "@/types"

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

function getLanguageIds(): string[] {
  try {
    return fs.readdirSync(SUBJECTS_DIR).filter((name) => {
      const stat = fs.statSync(path.join(SUBJECTS_DIR, name))
      return stat.isDirectory() && !name.startsWith(".")
    })
  } catch {
    return []
  }
}

export function getLanguageMeta(languageId: string): LanguageMeta | null {
  const metaPath = path.join(SUBJECTS_DIR, languageId, "meta.json")
  return readJsonSafe<LanguageMeta>(metaPath)
}

export function getSubjectIds(languageId: string): string[] {
  const langDir = path.join(SUBJECTS_DIR, languageId)
  try {
    return fs.readdirSync(langDir).filter((name) => {
      const stat = fs.statSync(path.join(langDir, name))
      return stat.isDirectory() && !name.startsWith(".") && name !== "tasks"
    })
  } catch {
    return []
  }
}

export function getSubjectMeta(languageId: string, subjectId: string): SubjectMeta | null {
  const metaPath = path.join(SUBJECTS_DIR, languageId, subjectId, "meta.json")
  return readJsonSafe<SubjectMeta>(metaPath)
}

export function getSubjectTheory(languageId: string, subjectId: string): string {
  const theoryPath = path.join(SUBJECTS_DIR, languageId, subjectId, "theory.md")
  return readFileSafe(theoryPath)
}

export function getSubjectTasks(languageId: string, subjectId: string): TaskMeta[] {
  const tasksDir = path.join(SUBJECTS_DIR, languageId, subjectId, "tasks")
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
          subjectId: `${languageId}/${subjectId}`,
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

export function getSubject(languageId: string, subjectId: string): Subject | null {
  const meta = getSubjectMeta(languageId, subjectId)
  if (!meta) return null
  return {
    meta: { ...meta, id: subjectId },
    theory: getSubjectTheory(languageId, subjectId),
    tasks: getSubjectTasks(languageId, subjectId),
  }
}

export function getTask(
  languageId: string,
  subjectId: string,
  taskId: string
): Task | null {
  const taskDir = path.join(SUBJECTS_DIR, languageId, subjectId, "tasks", taskId)
  const meta = readJsonSafe<TaskMeta>(path.join(taskDir, "meta.json"))
  if (!meta) return null

  return {
    meta: { ...meta, id: taskId, subjectId: `${languageId}/${subjectId}` },
    description: readFileSafe(path.join(taskDir, "task.md")),
    template: readFileSafe(path.join(taskDir, "template.txt")),
    testFiles: {},
  }
}

export function getAllLanguages(): LanguageMeta[] {
  return getLanguageIds()
    .map((id) => {
      const meta = getLanguageMeta(id)
      if (!meta) return null
      return { ...meta, id }
    })
    .filter((l): l is LanguageMeta => l !== null)
    .sort((a, b) => a.order - b.order)
}
