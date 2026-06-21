import { notFound } from "next/navigation"
import { getSubjectMeta, getTask } from "@/lib/subjects"
import { isTaskCompleted } from "@/lib/progress"
import { CodeEditor } from "@/components/CodeEditor"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { auth } from "@/lib/auth"

export default async function TaskPage({
  params,
}: {
  params: Promise<{ subjectId: string; taskId: string }>
}) {
  const { subjectId, taskId } = await params
  const subjectMeta = getSubjectMeta(subjectId)
  const task = getTask(subjectId, taskId)

  if (!subjectMeta || !task) notFound()

  const session = await auth()
  const completed =
    session?.user?.id
      ? await isTaskCompleted(subjectId, taskId)
      : false

  const langMap: Record<string, string> = {
    c: "c",
    cpp: "cpp",
    rust: "rust",
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6">
        <div className="text-sm text-stone-500 mb-1">
          {subjectMeta.icon} {subjectMeta.title} / Задание {task.meta.order}
        </div>
        <h1 className="text-2xl font-bold">{task.meta.title}</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="prose prose-invert prose-stone prose-sm max-w-none mb-6">
            <Markdown remarkPlugins={[remarkGfm]}>
              {task.description}
            </Markdown>
          </div>

          {completed && (
            <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg p-4 text-emerald-300 text-sm">
              ✓ Задание выполнено
            </div>
          )}
        </div>

        <div>
          <CodeEditor
            initialCode={task.template}
            language={langMap[subjectId] ?? "c"}
            subjectId={subjectId}
            taskId={taskId}
          />
        </div>
      </div>
    </div>
  )
}
