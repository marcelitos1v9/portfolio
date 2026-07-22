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
