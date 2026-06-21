import { auth } from "@/lib/auth"
import { getAllSubjects } from "@/lib/subjects"
import { getProgress } from "@/lib/progress"
import Link from "next/link"

export default async function SubjectsPage() {
  const session = await auth()
  const subjects = getAllSubjects()
  const progress = session ? await getProgress() : {}

  const totalTasks = subjects.reduce((sum, s) => sum + s.tasks.length, 0)
  const completedCount = Object.values(progress).reduce(
    (sum, tasks) => sum + tasks.filter((t) => t.completed).length, 0
  )

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

      <h1 className="text-3xl font-bold mb-8">
        {session ? "Предметы" : "Предметы"}
      </h1>

      <div className="space-y-4 mb-8">
        {subjects.map((subject) => {
          const subjectProgress = progress[subject.meta.id] ?? []
          const completed = subjectProgress.filter((p) => p.completed).length

          return (
            <Link
              key={subject.meta.id}
              href={`/subjects/${subject.meta.id}`}
              className="flex items-center gap-4 rounded-lg border border-stone-800 bg-stone-900/30 p-4 hover:border-stone-600 transition-all"
            >
              <div className="text-2xl">{subject.meta.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{subject.meta.title}</div>
                <div className="text-sm text-stone-400 truncate">{subject.meta.description}</div>
              </div>
              <div className="text-sm text-stone-500 whitespace-nowrap">
                {completed} / {subject.tasks.length}
              </div>
              <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden flex-shrink-0">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${subject.tasks.length > 0 ? (completed / subject.tasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      {!session && (
        <p className="text-center text-stone-500">
          <Link href="/auth" className="text-stone-300 underline hover:text-stone-100">
            Войдите
          </Link>, чтобы отслеживать прогресс
        </p>
      )}
    </div>
  )
}
