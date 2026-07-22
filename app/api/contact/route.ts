import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// ── Delivery providers (all optional) ────────────────────────────────
// The form works with zero configuration: if neither provider below is
// set, the route replies 501 and the client falls back to a prefilled
// mailto: link. Wire up real server-side delivery by setting either:
//   • RESEND_API_KEY  — sends an email via Resend (https://resend.com)
//   • CONTACT_WEBHOOK_URL — POSTs the payload (Discord/Slack/Zapier/…)
// Optional overrides: CONTACT_TO, CONTACT_FROM.
const CONTACT_TO = process.env.CONTACT_TO ?? "marceloaugustocge@gmail.com"
const CONTACT_FROM = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>"

// ── Best-effort in-memory rate limit ─────────────────────────────────
// Per-instance and reset on restart — enough to blunt casual abuse on a
// personal site. Move to a shared store (KV/Redis) if it ever matters.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  let body: { name?: string; email?: string; message?: string; company?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 })
  }

  // Honeypot: real users never fill a hidden "company" field. Pretend success.
  if (body.company) return NextResponse.json({ ok: true })

  const name = (body.name ?? "").trim().slice(0, 120)
  const email = (body.email ?? "").trim().slice(0, 200)
  const message = (body.message ?? "").trim().slice(0, 5000)

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const subject = `[Portfolio] Nova mensagem de ${name}`
  const text = `Nome: ${name}\nEmail: ${email}\n\n${message}`

  // Provider 1: Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM,
          to: [CONTACT_TO],
          reply_to: email,
          subject,
          text,
        }),
      })
      if (!res.ok) throw new Error(`Resend ${res.status}`)
      return NextResponse.json({ ok: true })
    } catch {
      return NextResponse.json({ error: "send_failed" }, { status: 502 })
    }
  }

  // Provider 2: generic webhook
  if (process.env.CONTACT_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `content` keeps it Discord-compatible out of the box.
        body: JSON.stringify({ content: `${subject}\n${text}`, name, email, message }),
      })
      if (!res.ok) throw new Error(`Webhook ${res.status}`)
      return NextResponse.json({ ok: true })
    } catch {
      return NextResponse.json({ error: "send_failed" }, { status: 502 })
    }
  }

  // No provider configured — tell the client to use the mailto fallback.
  return NextResponse.json({ error: "not_configured" }, { status: 501 })
}
