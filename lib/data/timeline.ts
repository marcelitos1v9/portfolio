export type TimelineEntry = {
  year: string
  label: string
  label_en: string
  description: string
  description_en: string
  detail?: string
}

export const timelineData: TimelineEntry[] = [
  {
    year: "2022",
    label: "ETEC",
    label_en: "ETEC",
    description: "Técnico em Desenvolvimento de Sistemas",
    description_en: "IT Systems Development Technician",
    detail: "ETEC · formação técnica",
  },
  {
    year: "2023",
    label: "Fatec Registro",
    label_en: "Fatec Registro",
    description: "Início do curso de DSM",
    description_en: "Started DSM degree",
    detail: "Tecnólogo em Desenvolvimento de Software Multiplataforma",
  },
  {
    year: "2023",
    label: "Cloud Eng. Intern",
    label_en: "Cloud Eng. Intern",
    description: "Compass UOL",
    description_en: "Compass UOL",
    detail: "AWS · GCP · CI/CD · DevOps",
  },
  {
    year: "2024",
    label: "Data Engineer",
    label_en: "Data Engineer",
    description: "Compass UOL · O&G",
    description_en: "Compass UOL · O&G",
    detail: "GCP · BigQuery · Dataform · Medallion",
  },
  {
    year: "2024",
    label: "AWS CCP",
    label_en: "AWS CCP",
    description: "Certified Cloud Practitioner",
    description_en: "Certified Cloud Practitioner",
    detail: "Amazon Web Services",
  },
  {
    year: "2025",
    label: "Oracle Cert.",
    label_en: "Oracle Cert.",
    description: "AI Agent Studio",
    description_en: "AI Agent Studio",
    detail: "Oracle Fusion",
  },
  {
    year: "2026",
    label: "Datalake Completo",
    label_en: "Complete Data Lake",
    description: "Medallion em produção",
    description_en: "Medallion in production",
    detail: "Staging → Bronze → Silver → Gold",
  },
]
