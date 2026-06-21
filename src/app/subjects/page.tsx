import { auth } from "@/lib/auth"
import { getAllLanguages, getSubjectIds, getSubjectMeta, getSubjectTasks } from "@/lib/subjects"
import { getProgress } from "@/lib/progress"
import Link from "next/link"

export default async function SubjectsPage() {
  const session = await auth()
  const languages = getAllLanguages()
  const allProgress = session ? await getProgress() : {}

  let totalTasks = 0
  let completedCount = 0
  if (session) {
    for (const lang of languages) {
      const subjects = getSubjectIds(lang.id)
      for (const subj of subjects) {
        const tasks = getSubjectTasks(lang.id, subj)
        totalTasks += tasks.length
        const key = `${lang.id}/${subj}`
        const subjProgress = allProgress[key] ?? []
        completedCount += subjProgress.filter((t: any) => t.completed).length
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {session && (
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6 mb-10">
          <div className="flex items-center gap-4 mb-4">
            {session.user?.image && (
              <img src={session.user.image} alt="" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <div className="font-medium">{session.user?.name ?? "Пользователь"}</div>
              <div className="text-sm text-stone-400">{session.user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{completedCount} / {totalTasks}</div>
            <div className="text-stone-400 text-sm">заданий выполнено</div>
          </div>
          <div className="mt-3 h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Языки программирования</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {languages.map((lang) => (
          <Link
            key={lang.id}
            href={`/subjects/${lang.id}`}
            className="group block rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-stone-600 hover:bg-stone-900 transition-all"
          >
            <div className="text-3xl mb-3">{lang.icon}</div>
            <h2 className="text-lg font-semibold mb-2">{lang.title}</h2>
            <p className="text-sm text-stone-400">{lang.description}</p>
          </Link>
        ))}
      </div>

      {!session && (
        <p className="text-center text-stone-500 mt-8">
          <Link href="/auth" className="text-stone-300 underline hover:text-stone-100">
            Войдите
          </Link>, чтобы отслеживать прогресс
        </p>
      )}
    </div>
  )
}
