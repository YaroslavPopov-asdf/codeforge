import { notFound } from "next/navigation"
import {
  getSubjectMeta,
  getSubjectTheory,
  getSubjectTasks,
} from "@/lib/subjects"
import { getProgress } from "@/lib/progress"
import { TaskList } from "@/components/TaskList"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = await params
  const meta = getSubjectMeta(subjectId)
  const theory = getSubjectTheory(subjectId)
  const tasks = getSubjectTasks(subjectId)

  if (!meta) notFound()

  const progress = await getProgress()
  const completedTasks = new Set(
    (progress[subjectId] ?? [])
      .filter((p) => p.completed)
      .map((p) => p.taskId)
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="text-4xl mb-2">{meta.icon}</div>
        <h1 className="text-3xl font-bold">{meta.title}</h1>
        <p className="text-stone-400 mt-1">{meta.description}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Теория</h2>
        <div className="prose prose-invert prose-stone prose-sm max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{theory}</Markdown>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Задания ({tasks.length})
        </h2>
        <TaskList
          subjectId={subjectId}
          tasks={tasks}
          completedTasks={completedTasks}
        />
      </section>
    </div>
  )
}
