import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { SessionProvider } from "@/components/SessionProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: "CodeForge — Изучение C, C++ и Rust",
  description:
    "Интерактивная платформа для изучения языков программирования C, C++ и Rust",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-stone-950 text-stone-100">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-stone-800 py-6 text-center text-sm text-stone-500">
            CodeForge — платформа для изучения системного программирования
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
