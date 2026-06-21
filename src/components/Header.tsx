"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="text-lg font-bold tracking-tight">
          CodeForge
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/subjects"
            className="text-stone-400 hover:text-stone-100 transition-colors"
          >
            Предметы
          </Link>

          {session ? (
            <>
              <Link
                href="/profile"
                className="text-stone-400 hover:text-stone-100 transition-colors"
              >
                {session.user?.name ?? "Профиль"}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-stone-400 hover:text-stone-100 transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-stone-100 text-stone-900 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
