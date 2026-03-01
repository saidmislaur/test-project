import { neon } from "@neondatabase/serverless"

export function getDb() {
  return neon(process.env.DATABASE_URL!)
}

export type Settings = Record<string, string>

export async function getSettings(): Promise<Settings> {
  const sql = getDb()
  const rows = await sql`SELECT key, value FROM settings`
  const settings: Settings = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }
  return settings
}
