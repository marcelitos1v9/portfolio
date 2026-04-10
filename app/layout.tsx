import type { Metadata, Viewport } from "next"
import { Fraunces, DM_Mono, DM_Sans } from "next/font/google"
import "./globals.css"
import LenisProvider from "@/components/ui/LenisProvider"
import CustomCursor from "@/components/ui/CustomCursor"
import ScrollProgress from "@/components/ui/ScrollProgress"
import Providers from "@/components/ui/Providers"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://marceloaguiar.dev"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Marcelo Augusto — Data Engineer & Full Stack",
    template: "%s — Marcelo Augusto",
  },
  description:
    "Engenheiro de Dados e Full Stack Developer. GCP, BigQuery, Dataform, Python, TypeScript, Go. Registro, SP.",
  keywords: [
    "Data Engineer",
    "Engenheiro de Dados",
    "GCP",
    "BigQuery",
    "Dataform",
    "Python",
    "TypeScript",
    "Go",
    "Medallion Architecture",
    "Full Stack",
    "Registro SP",
    "Compass UOL",
  ],
  authors: [{ name: "Marcelo Augusto Aguiar da Cruz" }],
  creator: "Marcelo Augusto Aguiar da Cruz",
  openGraph: {
    title: "Marcelo Augusto — Data Engineer & Full Stack",
    description:
      "Engenheiro de Dados e Full Stack Developer. GCP, BigQuery, Dataform, Python, TypeScript, Go.",
    url: BASE_URL,
    siteName: "Marcelo Augusto",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcelo Augusto — Data Engineer & Full Stack",
    description:
      "Engenheiro de Dados e Full Stack Developer. GCP, BigQuery, Dataform, Python, TypeScript, Go.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcelo Augusto Aguiar da Cruz",
  jobTitle: "Data Engineer",
  description:
    "Engenheiro de Dados especializado em arquitetura de dados em GCP com foco em pipelines medallion — BigQuery, Dataform, Cloud Run.",
  url: BASE_URL,
  email: "marceloaugustocge@gmail.com",
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
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${dmMono.variable} ${dmSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LenisProvider>
          <CustomCursor />
          <ScrollProgress />
          <Providers>
            {children}
          </Providers>
        </LenisProvider>
      </body>
    </html>
  )
}
