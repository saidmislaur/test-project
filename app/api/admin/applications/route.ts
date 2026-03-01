import { getDb } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { NextResponse } from "next/server"
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
    const sql = getDb()
    const applications = await sql`
      SELECT * FROM applications ORDER BY created_at DESC
    `
    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
