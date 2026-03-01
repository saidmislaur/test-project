import { getDb, getSettings } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) return false
  const payload = await verify(token)
  return payload?.role === "admin"
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const sql = getDb()

    for (const [key, value] of Object.entries(body)) {
      await sql`
        UPDATE settings SET value = ${String(value)}, updated_at = NOW()
        WHERE key = ${key}
      `
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
