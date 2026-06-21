"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import type { TaskMeta } from "@/types"

const difficultyLabels: Record<number, string> = {
  1: "Лёгкая",
  2: "Средняя",
  3: "Сложная",
}

const difficultyColors: Record<number, string> = {
  1: "bg-emerald-900/50 text-emerald-300",
  2: "bg-amber-900/50 text-amber-300",
  3: "bg-red-900/50 text-red-300",
}

export function TaskList({
  languageId,
  subjectId,
  tasks,
  completedTasks,
}: {
  languageId: string
  subjectId: string
  tasks: TaskMeta[]
  completedTasks: Set<string>
}) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const done = completedTasks.has(task.id)
        return (
          <Link
            key={task.id}
            href={`/subjects/${languageId}/${subjectId}/tasks/${task.id}`}
            className="flex items-center gap-4 rounded-lg border border-stone-800 bg-stone-900/30 p-4 hover:border-stone-600 transition-all"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                done
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "bg-stone-800 text-stone-400"
              }`}
            >
              {done ? "✓" : task.order}
            </div>
            <div className="flex-1">
              <div className="font-medium">{task.title}</div>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                difficultyColors[task.difficulty]
              }`}
            >
              {difficultyLabels[task.difficulty]}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
