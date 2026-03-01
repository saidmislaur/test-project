const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "installment-admin-secret-key-change-in-production"
)

export async function sign(payload: Record<string, unknown>): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const data = { ...payload, iat: now, exp: now + 86400 }

  const base64url = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

  const headerB64 = base64url(header)
  const payloadB64 = base64url(data)
  const message = `${headerB64}.${payloadB64}`

  const key = await crypto.subtle.importKey(
    "raw",
    SECRET,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  return `${message}.${sigB64}`
}

export async function verify(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, sigB64] = parts
    const message = `${headerB64}.${payloadB64}`

    const key = await crypto.subtle.importKey(
      "raw",
      SECRET,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const sigStr = atob(sigB64.replace(/-/g, "+").replace(/_/g, "/"))
    const sigArr = new Uint8Array(sigStr.length)
    for (let i = 0; i < sigStr.length; i++) {
      sigArr[i] = sigStr.charCodeAt(i)
    }

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigArr,
      new TextEncoder().encode(message)
    )

    if (!valid) return null

    const payloadStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    const payload = JSON.parse(payloadStr)

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
