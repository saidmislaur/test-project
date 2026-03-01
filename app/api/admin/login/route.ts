import { getDb } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { sign } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Введите пароль" }, { status: 400 })
    }

    const sql = getDb()
    const rows = await sql`SELECT value FROM settings WHERE key = 'admin_password'`

    if (rows.length === 0) {
      return NextResponse.json({ error: "Ошибка конфигурации" }, { status: 500 })
    }

    const storedPassword = rows[0].value

    if (password !== storedPassword) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 })
    }

    const token = await sign({ role: "admin" })

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (err) {
    console.log("[v0] Admin login error:", err)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
