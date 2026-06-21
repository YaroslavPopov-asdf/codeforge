import { NextRequest } from "next/server"
import { markTaskCompleted } from "@/lib/progress"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { keyPrefix, taskId } = await req.json()
  await markTaskCompleted(keyPrefix, taskId)
  return Response.json({ ok: true })
}
