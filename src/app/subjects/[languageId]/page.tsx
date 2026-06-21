import { notFound } from "next/navigation"
import {
  getLanguageMeta,
  getSubjectIds,
  getSubjectMeta,
  getSubjectTasks,
} from "@/lib/subjects"
import { getProgress } from "@/lib/progress"
import Link from "next/link"

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ languageId: string }>
}) {
  const { languageId } = await params
  const meta = getLanguageMeta(languageId)
  if (!meta) notFound()

  const subjectIds = getSubjectIds(languageId)
  const progress = await getProgress()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/subjects" className="text-sm text-stone-500 hover:text-stone-300">
          ← Все языки
        </Link>
        <div className="text-4xl mb-2 mt-2">{meta.icon}</div>
        <h1 className="text-3xl font-bold">{meta.title}</h1>
        <p className="text-stone-400 mt-1">{meta.description}</p>
      </div>

      <div className="space-y-4">
        {subjectIds.map((subjId) => {
          const subjMeta = getSubjectMeta(languageId, subjId)
          const tasks = getSubjectTasks(languageId, subjId)
          const key = `${languageId}/${subjId}`
          const subjProgress = progress[key] ?? []
          const completed = subjProgress.filter((p: any) => p.completed).length

          return (
            <Link
              key={subjId}
              href={`/subjects/${languageId}/${subjId}`}
              className="flex items-center gap-4 rounded-lg border border-stone-800 bg-stone-900/30 p-4 hover:border-stone-600 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium">{subjMeta?.title ?? subjId}</div>
              </div>
              <div className="text-sm text-stone-500 whitespace-nowrap">
                {completed} / {tasks.length}
              </div>
              <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden flex-shrink-0">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
