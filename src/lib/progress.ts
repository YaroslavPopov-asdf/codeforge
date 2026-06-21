import { auth } from "./auth"
import * as db from "./db"

export async function getProgress(): Promise<
  Record<string, { subjectId: string; taskId: string; completed: boolean }[]>
> {
  const session = await auth()
  if (!session?.user?.id) return {}

  const rows = db.getProgressByUserId(session.user.id)

  const grouped: Record<string, { subjectId: string; taskId: string; completed: boolean }[]> = {}
  for (const row of rows) {
    if (!grouped[row.subject_id]) grouped[row.subject_id] = []
    grouped[row.subject_id].push({
      subjectId: row.subject_id,
      taskId: row.task_id,
      completed: row.completed === 1,
    })
  }
  return grouped
}

export async function markTaskCompleted(
  subjectId: string,
  taskId: string
): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  db.upsertProgress(session.user.id, subjectId, taskId, true)
}

export async function isTaskCompleted(
  subjectId: string,
  taskId: string
): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) return false

  const rows = db.getProgressByUserId(session.user.id)
  return rows.some(
    (r) => r.subject_id === subjectId && r.task_id === taskId && r.completed === 1
  )
}
