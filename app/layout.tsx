import type { Metadata, Viewport } from "next"
import { Fraunces, DM_Mono, DM_Sans } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import LenisProvider from "@/components/ui/LenisProvider"
import Providers from "@/components/ui/Providers"
import { personJsonLd, projectsJsonLd } from "@/lib/seo/jsonLd"

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
    alternateLocale: ["en_US"],
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
    // Language toggle is client-side (same URLs), so we point both hreflang
    // values at the canonical URL plus an `x-default` for crawlers that
    // don't know the locale.
    languages: {
      "pt-BR": BASE_URL,
      en: BASE_URL,
      "x-default": BASE_URL,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const person = personJsonLd(BASE_URL)
  const projects = projectsJsonLd(BASE_URL)

  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${dmMono.variable} ${dmSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projects) }}
        />
      </head>
      <body>
        <LenisProvider>
          <Providers>{children}</Providers>
        </LenisProvider>
        {/* Privacy-friendly first-party analytics (no cookies); only loaded
            in production. Web Vitals are reported to Speed Insights. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
