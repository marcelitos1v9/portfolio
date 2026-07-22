// Server-side GitHub stats for project cards. Fetched at build / ISR with a
// 1-hour revalidation window, so it costs at most one request per repo per
// hour globally (never per-visitor) and never hits the unauthenticated
// rate limit. Every failure degrades gracefully to "no stats".
//
// Set GITHUB_TOKEN in the environment to raise the rate limit and read
// private repos; it is entirely optional — the module works without it.

import { projectsData } from "@/lib/data/projects"

export type RepoStats = {
  stars: number
  forks: number
  language: string | null
  /** ISO timestamp of the last push. */
  pushedAt: string
  htmlUrl: string
}

/** Extract `{ owner, repo }` from a canonical GitHub repo URL. Profile/org
 *  URLs (a single path segment, e.g. github.com/vvAi-Startup) return null. */
function parseRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null
  const m = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/)
  if (!m) return null
  return { owner: m[1], repo: m[2] }
}

export async function getGithubStats(): Promise<Record<string, RepoStats>> {
  const token = process.env.GITHUB_TOKEN
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "marcelo-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const targets = projectsData
    .map((p) => ({ slug: p.slug, parsed: parseRepo(p.repo) }))
    .filter(
      (e): e is { slug: string; parsed: { owner: string; repo: string } } =>
        e.parsed !== null
    )

  const results = await Promise.allSettled(
    targets.map(async ({ slug, parsed }) => {
      const res = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
        { headers, next: { revalidate: 3600 } }
      )
      if (!res.ok) throw new Error(`GitHub ${res.status} for ${slug}`)
      const data = await res.json()
      const stats: RepoStats = {
        stars: data.stargazers_count ?? 0,
        forks: data.forks_count ?? 0,
        language: data.language ?? null,
        pushedAt: data.pushed_at ?? "",
        htmlUrl: data.html_url ?? `https://github.com/${parsed.owner}/${parsed.repo}`,
      }
      return [slug, stats] as const
    })
  )

  const map: Record<string, RepoStats> = {}
  for (const r of results) {
    if (r.status === "fulfilled") map[r.value[0]] = r.value[1]
  }
  return map
}

const GH_USER = "marcelitos1v9"

export type ActivityItem = {
  type: "push" | "pr" | "create" | "release" | "fork"
  repo: string
  title: string
  createdAt: string
  url: string
}

/** Recent public GitHub activity for the /now page. Revalidated every 30 min.
 *  Returns [] on any failure so the page always renders. */
export async function getRecentActivity(limit = 6): Promise<ActivityItem[]> {
  const token = process.env.GITHUB_TOKEN
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "marcelo-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/events/public?per_page=30`,
      { headers, next: { revalidate: 1800 } }
    )
    if (!res.ok) return []
    const events: GithubEvent[] = await res.json()
    const items: ActivityItem[] = []

    for (const ev of events) {
      const repo = ev.repo?.name ?? ""
      const repoUrl = `https://github.com/${repo}`
      if (ev.type === "PushEvent") {
        const commits = ev.payload?.commits ?? []
        const last = commits[commits.length - 1]
        const msg = last?.message?.split("\n")[0] ?? `${ev.payload?.size ?? commits.length} commits`
        items.push({ type: "push", repo, title: msg, createdAt: ev.created_at, url: repoUrl })
      } else if (ev.type === "PullRequestEvent" && ev.payload?.pull_request) {
        items.push({
          type: "pr",
          repo,
          title: `${ev.payload.action} PR: ${ev.payload.pull_request.title}`,
          createdAt: ev.created_at,
          url: ev.payload.pull_request.html_url ?? repoUrl,
        })
      } else if (ev.type === "CreateEvent") {
        const ref = ev.payload?.ref
        const kind = ev.payload?.ref_type ?? "ref"
        items.push({
          type: "create",
          repo,
          title: ref ? `${kind} ${ref}` : `new ${kind}`,
          createdAt: ev.created_at,
          url: repoUrl,
        })
      } else if (ev.type === "ReleaseEvent" && ev.payload?.release) {
        items.push({
          type: "release",
          repo,
          title: `release ${ev.payload.release.tag_name ?? ""}`.trim(),
          createdAt: ev.created_at,
          url: ev.payload.release.html_url ?? repoUrl,
        })
      } else if (ev.type === "ForkEvent") {
        items.push({ type: "fork", repo, title: "forked", createdAt: ev.created_at, url: repoUrl })
      }
      if (items.length >= limit) break
    }
    // GitHub only keeps ~90 days of public events, so the feed is often empty.
    // Fall back to the most recently pushed repos — always a real signal.
    if (items.length === 0) return getRecentlyPushedRepos(headers, limit)
    return items
  } catch {
    return []
  }
}

async function getRecentlyPushedRepos(
  headers: HeadersInit,
  limit: number
): Promise<ActivityItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/repos?sort=pushed&per_page=${limit}&type=owner`,
      { headers, next: { revalidate: 1800 } }
    )
    if (!res.ok) return []
    const repos: {
      full_name: string
      html_url: string
      pushed_at: string
      description: string | null
      language: string | null
    }[] = await res.json()
    return repos.map((r) => ({
      type: "push" as const,
      repo: r.full_name,
      title: r.description ?? (r.language ? `${r.language} repo` : "repository"),
      createdAt: r.pushed_at,
      url: r.html_url,
    }))
  } catch {
    return []
  }
}

// Minimal shape of the GitHub Events API payloads we consume.
type GithubEvent = {
  type: string
  created_at: string
  repo?: { name: string }
  payload?: {
    size?: number
    ref?: string
    ref_type?: string
    action?: string
    commits?: { message: string }[]
    pull_request?: { title: string; html_url?: string }
    release?: { tag_name?: string; html_url?: string }
  }
}
