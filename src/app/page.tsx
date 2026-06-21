import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Изучайте системное программирование
        </h1>
        <p className="text-lg text-stone-400 max-w-xl mx-auto mb-8">
          Интерактивные уроки по C, C++ и Rust с практическими заданиями
          и автоматической проверкой кода
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/subjects"
            className="bg-stone-100 text-stone-900 px-6 py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Начать обучение
          </Link>
          {!session && (
            <Link
              href="/auth"
              className="border border-stone-700 text-stone-300 px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Войти
            </Link>
          )}
        </div>
      </section>

      <section className="py-16 border-t border-stone-800">
        <h2 className="text-2xl font-bold mb-8 text-center">Что вы изучите</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚙️",
              title: "C",
              desc: "Фундаментальный язык системного программирования. Указатели, управление памятью, алгоритмы.",
            },
            {
              icon: "🔧",
              title: "C++",
              desc: "Объектно-ориентированное и обобщённое программирование. STL, классы, шаблоны.",
            },
            {
              icon: "🦀",
              title: "Rust",
              desc: "Безопасная работа с памятью. Владение, заимствование, современные идиомы.",
            },
          ].map((lang) => (
            <div
              key={lang.title}
              className="rounded-xl border border-stone-800 bg-stone-900/50 p-6"
            >
              <div className="text-3xl mb-3">{lang.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
              <p className="text-sm text-stone-400">{lang.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
