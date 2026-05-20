"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import type { ProjectEntry } from "@/lib/data/projects"

export default function ProjectClientWrapper({ project }: { project: ProjectEntry }) {
  const { lang, t } = useLanguage()

  const role = lang === "en" ? project.role_en : project.role
  const context = lang === "en" ? project.context_en : project.context
  const summary = lang === "en" ? project.summary_en : project.summary
  const bullets = lang === "en" ? project.bullets_en : project.bullets

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href="/#projects"
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "2.5rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-heading)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
      >
        {t.project_back}
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: "var(--color-accent)",
          }}
        >
          {project.index}
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
          }}
        >
          {project.period}
        </span>
      </div>

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
        {project.name}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 1rem",
          marginBottom: "2.5rem",
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "var(--color-accent)" }}>{role}</span>
        <span style={{ color: "var(--color-decorative)" }}>·</span>
        <span style={{ color: "var(--color-muted)" }}>{context}</span>
      </div>

      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
          color: "var(--color-body)",
          lineHeight: 1.75,
          maxWidth: 720,
          marginBottom: "2.5rem",
        }}
      >
        {summary}
      </p>

      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "3rem",
          maxWidth: 720,
        }}
      >
        {bullets.map((bullet, i) => (
          <li key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
            <span
              aria-hidden="true"
              style={{
                color: "var(--color-accent)",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                marginTop: "0.35rem",
                flexShrink: 0,
              }}
            >
              —
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.95rem",
                color: "var(--color-body)",
                lineHeight: 1.75,
              }}
            >
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: project.link || project.repo ? "2.5rem" : 0,
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
              padding: "0.35rem 0.75rem",
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {(project.link || project.repo) && (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={projectLinkStyle("primary")}
            >
              {t.projects_view}
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={projectLinkStyle("muted")}
            >
              {t.projects_github}
            </a>
          )}
        </div>
      )}
    </motion.article>
  )
}

function projectLinkStyle(variant: "primary" | "muted"): React.CSSProperties {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
    textDecoration: "none",
    padding: "0.85rem 1.5rem",
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
  }
  if (variant === "primary") {
    return {
      ...base,
      color: "var(--color-bg)",
      background: "var(--color-accent)",
      border: "1px solid var(--color-accent)",
    }
  }
  return {
    ...base,
    color: "var(--color-body)",
    border: "1px solid var(--color-border)",
  }
}
