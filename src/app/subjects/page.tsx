import { getAllSubjects } from "@/lib/subjects"
import { SubjectCard } from "@/components/SubjectCard"

export default function SubjectsPage() {
  const subjects = getAllSubjects()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Предметы</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject.meta.id} meta={subject.meta} />
        ))}
      </div>
    </div>
  )
}
