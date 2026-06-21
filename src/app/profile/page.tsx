import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getAllSubjects } from "@/lib/subjects"
import { getProgress } from "@/lib/progress"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  const subjects = getAllSubjects()
  const progress = await getProgress()

  const totalTasks = subjects.reduce(
    (sum, s) => sum + s.tasks.length,
    0
  )
  const completedCount = Object.values(progress).reduce(
    (sum, tasks) =>
      sum + tasks.filter((t) => t.completed).length,
    0
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-6 mb-10">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {session.user.name ?? "Пользователь"}
          </h1>
          <p className="text-stone-400">{session.user.email}</p>
        </div>
      </div>

      <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6 mb-10">
        <div className="text-3xl font-bold mb-1">
          {completedCount} / {totalTasks}
        </div>
        <div className="text-stone-400 text-sm">заданий выполнено</div>
        <div className="mt-4 h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: `${
                totalTasks > 0
                  ? (completedCount / totalTasks) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Прогресс по предметам</h2>
        <div className="space-y-4">
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
                <div className="flex-1">
                  <div className="font-medium">{subject.meta.title}</div>
                  <div className="text-sm text-stone-400">
                    {completed} / {subject.tasks.length} заданий
                  </div>
                </div>
                <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${
                        subject.tasks.length > 0
                          ? (completed / subject.tasks.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
