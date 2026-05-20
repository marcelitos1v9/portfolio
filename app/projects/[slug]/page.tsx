import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { projectsData } from "@/lib/data/projects"
import ProjectClientWrapper from "./ProjectClientWrapper"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return projectsData.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug)
  if (!project) return {}

  return {
    title: project.name,
    description: project.summary,
    openGraph: {
      title: `${project.name} — Marcelo Augusto`,
      description: project.summary,
      type: "article",
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: "calc(64px + clamp(3rem, 8vw, 6rem))",
          paddingBottom: "clamp(5rem, 12vw, 10rem)",
          paddingLeft: "clamp(1.5rem, 8vw, 8rem)",
          paddingRight: "clamp(1.5rem, 8vw, 8rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ProjectClientWrapper project={project} />
      </main>

      <Footer />
    </>
  )
}
