"use client"

import { useState } from "react"
import Link from "next/link"
import { useInView } from "@/hooks/useInView"
import { projectsData, type ProjectEntry } from "@/lib/data/projects"
import type { RepoStats } from "@/lib/data/github"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Projects({
  githubStats = {},
}: {
  githubStats?: Record<string, RepoStats>
}) {
  const [active, setActive] = useState<ProjectEntry>(projectsData[0])
  const { ref: titleRef, isVisible: titleVisible } = useInView()
  const { lang, t } = useLanguage()

  return (
    <section
      id="projects"
      style={{
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 8rem)",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div ref={titleRef} style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            display: "block",
            marginBottom: "0.75rem",
          }}
        >
          {t.projects_label}
        </span>
        <h2
          className={`reveal ${titleVisible ? "is-visible" : ""}`}
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
            color: "var(--color-heading)",
            lineHeight: 1.2,
          }}
        >
          {t.projects_heading}
        </h2>
      </div>

      {/* Two-panel layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "clamp(2rem, 4vw, 4rem)",
        }}
        className="projects-layout"
      >
        {/* Left: index list */}
        <div
          style={{
            borderRight: "1px solid var(--color-border)",
            paddingRight: "clamp(1.5rem, 3vw, 3rem)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {projectsData.map((project) => {
            const isActive = active.name === project.name
            return (
              <button
                key={project.name}
                onClick={() => setActive(project)}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  padding: "1.25rem 0 1.25rem 1rem",
                  borderBottom: "1px solid var(--color-border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  transition: "opacity 0.2s",
                  opacity: isActive ? 1 : 0.55,
                  position: "relative",
                  minHeight: 56,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = "0.85"
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = "0.55"
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: "var(--color-accent)",
                    }}
                  />
                )}

                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.625rem",
                    color: isActive ? "var(--color-accent)" : "var(--color-muted)",
                    letterSpacing: "0.1em",
                    flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                >
                  {project.index}
                </span>

                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                      fontWeight: 300,
                      color: "var(--color-heading)",
                      display: "block",
                      lineHeight: 1.2,
                    }}
                  >
                    {project.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: "0.65rem",
                      color: "var(--color-muted)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {project.period}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: project detail with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.name + lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectDetail project={active} lang={lang} t={t} stats={githubStats[active.slug]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .projects-layout {
            grid-template-columns: 1fr !important;
          }
          .projects-layout > div:first-child {
            border-right: none !important;
            padding-right: 0 !important;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 2rem;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  )
}

function ProjectDetail({
  project,
  lang,
  t,
  stats,
}: {
  project: ProjectEntry
  lang: string
  t: {
    projects_view: string
    projects_github: string
    projects_detail_link: string
    projects_gh_updated: string
    projects_gh_stars_aria: string
    projects_gh_live: string
  }
  stats?: RepoStats
}) {
  const role = lang === "en" ? project.role_en : project.role
  const context = lang === "en" ? project.context_en : project.context
  const summary = lang === "en" ? project.summary_en : project.summary
  const bullets = lang === "en" ? project.bullets_en : project.bullets

  return (
    <div>
      {/* Live GitHub stats — only when the repo resolved server-side */}
      {stats && (
        <GithubStatsRow stats={stats} lang={lang} t={t} />
      )}

      {/* Context + role */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          {role}
        </span>
        <span style={{ color: "var(--color-muted)", fontSize: "0.625rem" }}>·</span>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
          }}
        >
          {context}
        </span>
      </div>

      {/* Summary */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
          color: "var(--color-body)",
          lineHeight: 1.8,
          marginBottom: "2rem",
          maxWidth: "560px",
        }}
      >
        {summary}
      </p>

      {/* Bullets */}
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          marginBottom: "2rem",
        }}
      >
        {bullets.map((bullet, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "0.875rem",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                color: "var(--color-accent)",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                marginTop: "0.3rem",
                flexShrink: 0,
              }}
            >
              —
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.9rem",
                color: "var(--color-body)",
                lineHeight: 1.7,
              }}
            >
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
              padding: "0.3rem 0.7rem",
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          href={`/projects/${project.slug}`}
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            color: "var(--color-heading)",
            textDecoration: "none",
            border: "1px solid var(--color-accent)",
            padding: "0.5rem 1rem",
            transition: "background 0.2s, color 0.2s",
            display: "inline-flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent)"
            e.currentTarget.style.color = "var(--color-bg)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "var(--color-heading)"
          }}
        >
          {t.projects_detail_link}
        </Link>
        {project.link && (
          <ProjectLink href={project.link}>{t.projects_view}</ProjectLink>
        )}
        {project.repo && (
          <ProjectLink href={project.repo} muted>
            {t.projects_github}
          </ProjectLink>
        )}
      </div>
    </div>
  )
}

/** Human-readable "x days/months ago" using the platform Intl formatter. */
function relativeTime(iso: string, lang: string): string {
  if (!iso) return ""
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const diffMs = then - Date.now()
  const rtf = new Intl.RelativeTimeFormat(lang === "en" ? "en" : "pt-BR", { numeric: "auto" })
  const abs = Math.abs(diffMs)
  const day = 86_400_000
  if (abs < day) return rtf.format(Math.round(diffMs / 3_600_000), "hour")
  if (abs < 30 * day) return rtf.format(Math.round(diffMs / day), "day")
  if (abs < 365 * day) return rtf.format(Math.round(diffMs / (30 * day)), "month")
  return rtf.format(Math.round(diffMs / (365 * day)), "year")
}

// Language → dot color, matching common GitHub language colors.
const LANG_COLOR: Record<string, string> = {
  Go: "#00ADD8",
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Kotlin: "#A97BFF",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
}

function GithubStatsRow({
  stats,
  lang,
  t,
}: {
  stats: RepoStats
  lang: string
  t: { projects_gh_updated: string; projects_gh_stars_aria: string; projects_gh_live: string }
}) {
  const itemStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.05em",
    color: "var(--color-muted)",
  }
  return (
    <div
      title={t.projects_gh_live}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1.25rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Live indicator */}
      <span style={{ ...itemStyle, color: "var(--color-accent)" }}>
        <span
          aria-hidden="true"
          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", boxShadow: "0 0 6px var(--color-accent)" }}
        />
        GitHub
      </span>

      <span style={itemStyle}>
        <span aria-hidden="true">★</span>
        <span aria-label={`${stats.stars} ${t.projects_gh_stars_aria}`}>{stats.stars}</span>
      </span>

      {stats.forks > 0 && (
        <span style={itemStyle}>
          <span aria-hidden="true">⑂</span>
          {stats.forks}
        </span>
      )}

      {stats.language && (
        <span style={itemStyle}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: LANG_COLOR[stats.language] ?? "var(--color-decorative)",
            }}
          />
          {stats.language}
        </span>
      )}

      {stats.pushedAt && (
        <span style={itemStyle}>
          {t.projects_gh_updated} {relativeTime(stats.pushedAt, lang)}
        </span>
      )}
    </div>
  )
}

function ProjectLink({
  href,
  children,
  muted,
}: {
  href: string
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: "var(--font-dm-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.08em",
        color: muted ? "var(--color-body)" : "var(--color-heading)",
        textDecoration: "none",
        border: `1px solid ${muted ? "var(--color-border)" : "var(--color-accent)"}`,
        padding: "0.5rem 1rem",
        transition: "border-color 0.2s, color 0.2s",
        display: "inline-flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)"
        e.currentTarget.style.color = "var(--color-accent)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = muted ? "var(--color-border)" : "var(--color-accent)"
        e.currentTarget.style.color = muted ? "var(--color-body)" : "var(--color-heading)"
      }}
    >
      {children}
    </a>
  )
}
