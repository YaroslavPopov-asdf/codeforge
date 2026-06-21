import { notFound } from "next/navigation"
import { getLanguageMeta, getSubject, getTask } from "@/lib/subjects"
import { isTaskCompleted } from "@/lib/progress"
import { CodeEditor } from "@/components/CodeEditor"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { auth } from "@/lib/auth"
import Link from "next/link"

export default async function TaskPage({
  params,
}: {
  params: Promise<{ languageId: string; subjectId: string; taskId: string }>
}) {
  const { languageId, subjectId, taskId } = await params
  const langMeta = getLanguageMeta(languageId)
  const subject = getSubject(languageId, subjectId)
  const task = getTask(languageId, subjectId, taskId)

  if (!langMeta || !subject || !task) notFound()

  const session = await auth()
  const taskKey = `${languageId}/${subjectId}`
  const completed = session?.user?.id
    ? await isTaskCompleted(taskKey, taskId)
    : false

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6">
        <div className="text-sm text-stone-500 mb-1">
          <Link href={`/subjects/${languageId}`} className="hover:text-stone-300">
            {langMeta.icon} {langMeta.title}
          </Link>
          {" / "}
          <Link href={`/subjects/${languageId}/${subjectId}`} className="hover:text-stone-300">
            {subject.meta.title}
          </Link>
          {" / Задание "}{task.meta.order}
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
            language={languageId}
            keyPrefix={`${languageId}/${subjectId}`}
            taskId={taskId}
          />
        </div>
      </div>
    </div>
  )
}
