"use client"

import { useState } from "react"

interface TestResult {
  name: string
  passed: boolean
  output: string
}

interface CodeEditorProps {
  initialCode: string
  language: string
  keyPrefix: string
  taskId: string
}

export function CodeEditor({
  initialCode,
  language,
  keyPrefix,
  taskId,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [running, setRunning] = useState(false)
  const [passed, setPassed] = useState<boolean | null>(null)

  async function runCode() {
    setRunning(true)
    setOutput("")
    setTestResults([])
    setPassed(null)

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyPrefix, taskId, code, language }),
      })
      if (!res.ok) {
        const text = await res.text()
        setOutput(`Ошибка сервера (${res.status}): ${text}`)
        setPassed(false)
        return
      }

      const data = await res.json()

      setOutput(data.errors ?? data.output ?? "")
      setTestResults(data.testResults ?? [])
      setPassed(data.passed ?? false)

      if (data.passed) {
        try {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyPrefix, taskId }),
          })
        } catch {
          // non-critical
        }
      }
    } catch {
      setOutput("Ошибка при выполнении запроса. Проверьте, что runner запущен.")
      setPassed(false)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute top-3 right-3 text-xs text-stone-500 font-mono">
          {language}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault()
              const ta = e.currentTarget
              const start = ta.selectionStart
              const end = ta.selectionEnd
              const newVal = code.slice(0, start) + "\t" + code.slice(end)
              setCode(newVal)
              requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 1
              })
            }
          }}
          className="w-full h-64 bg-stone-900 border border-stone-700 rounded-lg p-4 font-mono text-sm text-stone-100 resize-y focus:outline-none focus:border-stone-500"
          spellCheck={false}
        />
      </div>

      <button
        onClick={runCode}
        disabled={running}
        className="bg-stone-100 text-stone-900 px-5 py-2 rounded-lg font-medium hover:bg-stone-200 transition-colors disabled:opacity-50"
      >
        {running ? "Выполнение..." : "Запустить тесты"}
      </button>

      {passed !== null && (
        <div
          className={`p-4 rounded-lg ${
            passed
              ? "bg-emerald-900/20 border border-emerald-800"
              : "bg-red-900/20 border border-red-800"
          }`}
        >
          <div className="font-semibold mb-2">
            {passed ? "Все тесты пройдены!" : "Некоторые тесты не пройдены"}
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2 mt-3">
              {testResults.map((tr, i) => (
                <div
                  key={i}
                  className={`text-sm p-2 rounded ${
                    tr.passed
                      ? "bg-emerald-950/50 text-emerald-300"
                      : "bg-red-950/50 text-red-300"
                  }`}
                >
                  <span className="font-medium">{tr.name}</span>
                  {!tr.passed && tr.output && (
                    <pre className="mt-1 text-xs whitespace-pre-wrap font-mono text-stone-400">
                      {tr.output}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}

          {output && (
            <pre className="mt-3 text-sm whitespace-pre-wrap font-mono text-stone-400 bg-stone-950/50 p-3 rounded">
              {output}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
