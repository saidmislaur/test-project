import { getSettings } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    )
  }
}
