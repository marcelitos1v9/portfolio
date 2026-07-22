"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { NOW_SECTIONS, NOW_UPDATED_AT } from "@/lib/data/now"
import type { ActivityItem } from "@/lib/data/github"

const ACTIVITY_ICON: Record<ActivityItem["type"], string> = {
  push: "●",
  pr: "⇅",
  create: "+",
  release: "▲",
  fork: "⑂",
}

export default function NowClient({ activity = [] }: { activity?: ActivityItem[] }) {
  const { lang, t } = useLanguage()

  const fmtDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00")
    return d.toLocaleDateString(lang === "en" ? "en-US" : "pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const relTime = (iso: string) => {
    const then = new Date(iso).getTime()
    if (Number.isNaN(then)) return ""
    const diff = then - Date.now()
    const rtf = new Intl.RelativeTimeFormat(lang === "en" ? "en" : "pt-BR", { numeric: "auto" })
    const abs = Math.abs(diff)
    const h = 3_600_000
    if (abs < h) return rtf.format(Math.round(diff / 60_000), "minute")
    if (abs < 24 * h) return rtf.format(Math.round(diff / h), "hour")
    return rtf.format(Math.round(diff / (24 * h)), "day")
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <span className="label-mono" style={{ display: "block", marginBottom: "0.75rem" }}>
        {t.now_label}
      </span>
      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          fontWeight: 300,
          color: "var(--color-heading)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          marginBottom: "1.25rem",
        }}
      >
        {t.now_heading}
      </h1>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
          color: "var(--color-body)",
          lineHeight: 1.7,
          marginBottom: "0.75rem",
        }}
      >
        {t.now_subtitle}
      </p>
      <p
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          color: "var(--color-muted)",
          marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        {t.now_updated} {fmtDate(NOW_UPDATED_AT)}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
        {NOW_SECTIONS.map((section) => (
          <section key={section.title_en}>
            <h2
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {lang === "en" ? section.title_en : section.title_pt}
            </h2>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: item.tag ? "auto 1fr" : "1fr",
                    gap: "1rem",
                    alignItems: "baseline",
                  }}
                >
                  {item.tag && (
                    <span
                      style={{
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        color: "var(--color-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.tag}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "1rem",
                      color: "var(--color-body)",
                      lineHeight: 1.65,
                    }}
                  >
                    {lang === "en" ? item.en : item.pt}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Live GitHub activity — real, self-updating (30-min ISR) */}
        {activity.length > 0 && (
          <section>
            <h2
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  boxShadow: "0 0 6px var(--color-accent)",
                }}
              />
              {t.now_activity_title}
            </h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {activity.map((item, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0.85rem", alignItems: "baseline" }}>
                  <span aria-hidden="true" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", color: "var(--color-muted)" }}>
                    {ACTIVITY_ICON[item.type]}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.95rem", color: "var(--color-body)", lineHeight: 1.6, textDecoration: "none" }}
                  >
                    <span style={{ color: "var(--color-muted)", fontFamily: "var(--font-dm-mono)", fontSize: "0.78rem" }}>
                      {item.repo.split("/")[1] ?? item.repo}
                    </span>{" "}
                    {item.title}
                  </a>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", color: "var(--color-muted)", whiteSpace: "nowrap" }}>
                    {relTime(item.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
