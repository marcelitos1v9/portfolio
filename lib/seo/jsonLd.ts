import { projectsData } from "@/lib/data/projects"

export function personJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marcelo Augusto Aguiar da Cruz",
    alternateName: "Marcelo Augusto",
    jobTitle: "Data Engineer",
    description:
      "Engenheiro de Dados especializado em arquitetura de dados em GCP com foco em pipelines medallion — BigQuery, Dataform, Cloud Run.",
    url: baseUrl,
    email: "marceloaugustocge@gmail.com",
    image: `${baseUrl}/opengraph-image`,
    sameAs: [
      "https://www.linkedin.com/in/marcelo-augusto-oo/",
      "https://github.com/marcelitos1v9",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Registro",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Fatec Registro",
    },
    worksFor: {
      "@type": "Organization",
      name: "Compass UOL",
      url: "https://compass.uol/",
    },
    knowsAbout: [
      "Data Engineering",
      "Google Cloud Platform",
      "BigQuery",
      "Dataform",
      "Medallion Architecture",
      "Python",
      "TypeScript",
      "Go",
    ],
    knowsLanguage: ["pt-BR", "en"],
  }
}

export function projectsJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projetos selecionados — Marcelo Augusto",
    itemListElement: projectsData.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.name,
        description: p.summary,
        keywords: p.tags.join(", "),
        url: p.link ?? `${baseUrl}/projects/${slugify(p.name)}`,
        codeRepository: p.repo,
        creator: { "@type": "Person", name: "Marcelo Augusto Aguiar da Cruz" },
      },
    })),
  }
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
