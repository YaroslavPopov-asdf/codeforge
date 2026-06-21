import Link from "next/link"
import type { SubjectMeta } from "@/types"

export function SubjectCard({ meta }: { meta: SubjectMeta }) {
  return (
    <Link
      href={`/subjects/${meta.id}`}
      className="group block rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-stone-600 hover:bg-stone-900 transition-all"
    >
      <div className="text-3xl mb-3">{meta.icon}</div>
      <h2 className="text-lg font-semibold mb-2">{meta.title}</h2>
      <p className="text-sm text-stone-400">{meta.description}</p>
    </Link>
  )
}
