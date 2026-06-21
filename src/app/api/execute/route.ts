import { NextRequest } from "next/server"
import { getTask } from "@/lib/subjects"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { auth } from "@/lib/auth"

const RUNNER_URL = process.env.RUNNER_URL ?? "http://localhost:8080"

interface TestCase {
  name: string
  stdin: string
  expected_stdout: string
  expected_exit_code: number
}

interface TestSpec {
  type: "io" | "unit"
  timeout: number
  cases: TestCase[]
  harness?: string
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { subjectId, taskId, code, language } = await req.json()
  const task = getTask(subjectId, taskId)

  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 })
  }

  const taskDir = path.join(
    process.cwd(),
    "subjects",
    subjectId,
    "tasks",
    taskId
  )
  const testsPath = path.join(taskDir, "tests.json")

  if (!fs.existsSync(testsPath)) {
    return Response.json({ error: "Tests not found" }, { status: 404 })
  }

  const spec: TestSpec = JSON.parse(fs.readFileSync(testsPath, "utf-8"))

  const runnerUrl = process.env.RUNNER_URL

  if (runnerUrl) {
    const res = await fetch(`${runnerUrl}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: subjectId,
        task_id: taskId,
        code,
        language,
        spec,
      }),
    })
    const result = await res.json()
    return Response.json(result)
  }

  const result = await runLocally(code, language, spec, taskDir)
  return Response.json(result)
}

async function runLocally(
  code: string,
  language: string,
  spec: TestSpec,
  workDir: string
) {
  const tmpDir = fs.mkdtempSync("/tmp/codeforge-")
  const extMap: Record<string, string> = {
    c: "c",
    cpp: "cpp",
    rust: "rs",
  }
  const ext = extMap[language] ?? "c"
  const srcFile = path.join(tmpDir, `solution.${ext}`)
  const binary = path.join(tmpDir, "solution")

  fs.writeFileSync(srcFile, code)

  const results: { name: string; passed: boolean; output: string }[] = []
  let compileOutput = ""

  try {
    let compileCmd = ""
    if (language === "c") {
      compileCmd = `gcc -Wall -Wextra -std=c99 -o ${binary} ${srcFile} 2>&1`
    } else if (language === "cpp") {
      compileCmd = `g++ -Wall -Wextra -std=c++17 -o ${binary} ${srcFile} 2>&1`
    } else if (language === "rust") {
      compileCmd = `rustc -o ${binary} ${srcFile} 2>&1`
    } else {
      return { passed: false, output: "Unsupported language", testResults: [] }
    }

    compileOutput = execSync(compileCmd, {
      cwd: tmpDir,
      timeout: 30000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    })
  } catch (e: any) {
    return {
      passed: false,
      output: "",
      errors: e.stderr ?? e.message,
      testResults: [],
    }
  }

  for (const testCase of spec.cases) {
    try {
      const out = execSync(binary, {
        cwd: tmpDir,
        timeout: (spec.timeout ?? 5) * 1000,
        input: testCase.stdin,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })

      const passed = out === testCase.expected_stdout
      results.push({
        name: testCase.name,
        passed,
        output: passed ? "" : `Ожидалось: ${JSON.stringify(testCase.expected_stdout)}\nПолучено: ${JSON.stringify(out)}`,
      })
    } catch (e: any) {
      results.push({
        name: testCase.name,
        passed: false,
        output: e.stderr ?? e.message,
      })
    }
  }

  cleanup(tmpDir)

  const allPassed = results.every((r) => r.passed)
  return {
    passed: allPassed,
    output: compileOutput,
    testResults: results,
  }
}

function cleanup(dir: string) {
  try {
    fs.rmSync(dir, { recursive: true, force: true })
  } catch {
    // ignore
  }
}
