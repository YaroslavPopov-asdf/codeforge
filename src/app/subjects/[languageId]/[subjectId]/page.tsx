import { notFound } from "next/navigation"
import {
  getLanguageMeta,
  getSubject,
  getSubjectTasks,
} from "@/lib/subjects"
import { getProgress } from "@/lib/progress"
import { TaskList } from "@/components/TaskList"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ languageId: string; subjectId: string }>
}) {
  const { languageId, subjectId } = await params
  const langMeta = getLanguageMeta(languageId)
  const subject = getSubject(languageId, subjectId)

  if (!langMeta || !subject) notFound()

  const progress = await getProgress()
  const key = `${languageId}/${subjectId}`
  const completedTasks = new Set(
    (progress[key] ?? [])
      .filter((p: any) => p.completed)
      .map((p: any) => p.taskId)
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href={`/subjects/${languageId}`}
          className="text-sm text-stone-500 hover:text-stone-300"
        >
          ← {langMeta.title}
        </Link>
        <h1 className="text-2xl font-bold mt-2">{subject.meta.title}</h1>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Теория</h2>
        <div className="prose prose-invert prose-stone prose-sm max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{subject.theory}</Markdown>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Задания ({subject.tasks.length})
        </h2>
        <TaskList
          languageId={languageId}
          subjectId={subjectId}
          tasks={subject.tasks}
          completedTasks={completedTasks}
        />
      </section>
    </div>
  )
}
