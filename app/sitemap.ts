import type { MetadataRoute } from "next"
import { projectsData } from "@/lib/data/projects"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://marceloaguiar.dev"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/stack`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/playground`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...projectsData.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
