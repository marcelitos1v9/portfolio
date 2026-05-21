/* eslint-disable @next/next/no-img-element */
import { Document, Page, Text, View, StyleSheet, Link, Font } from "@react-pdf/renderer"
import { projectsData } from "@/lib/data/projects"
import { timelineData } from "@/lib/data/timeline"
import { stackData } from "@/lib/data/stack"

// Register the Google Fonts used elsewhere in the site so the PDF matches
// the on-screen typography. @react-pdf needs explicit TTF URLs.
Font.register({
  family: "Fraunces",
  src: "https://fonts.gstatic.com/s/fraunces/v36/6NUh8FyLNQOQZAnv9ZwNjucMHVn85Ni7emA.ttf",
})
Font.register({
  family: "DMSans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g7vN_AKjPLQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriCZ-w7vN_AKjPLQ.ttf",
      fontWeight: 500,
    },
  ],
})
Font.register({
  family: "DMMono",
  src: "https://fonts.gstatic.com/s/dmmono/v14/aFTU7PB1QTsUX8KYhh2aBYyMcKw.ttf",
})

const PALETTE = {
  bg: "#FFFFFF",
  ink: "#0D0D0D",
  body: "#3A3A3A",
  muted: "#6B6B6B",
  accent: "#B5942A",
  border: "#E5E5E5",
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: PALETTE.bg,
    color: PALETTE.body,
    padding: "32 40",
    fontFamily: "DMSans",
    fontSize: 9.5,
    lineHeight: 1.45,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.ink,
    paddingBottom: 12,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  name: {
    fontFamily: "Fraunces",
    fontSize: 28,
    color: PALETTE.ink,
    letterSpacing: -0.5,
  },
  role: {
    fontFamily: "DMMono",
    fontSize: 9,
    color: PALETTE.accent,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 8,
    fontFamily: "DMMono",
    fontSize: 8,
    color: PALETTE.muted,
  },
  sectionTitle: {
    fontFamily: "DMMono",
    fontSize: 8,
    color: PALETTE.ink,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: PALETTE.border,
  },
  paragraph: {
    fontSize: 9.5,
    color: PALETTE.body,
    marginBottom: 4,
  },
  twoCol: {
    flexDirection: "row",
    gap: 20,
  },
  colMain: {
    flex: 1.6,
  },
  colSide: {
    flex: 1,
  },
  jobBlock: {
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 500,
    color: PALETTE.ink,
  },
  jobMeta: {
    fontFamily: "DMMono",
    fontSize: 8,
    color: PALETTE.muted,
  },
  jobContext: {
    fontFamily: "DMMono",
    fontSize: 8,
    color: PALETTE.muted,
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  bulletDash: {
    width: 8,
    color: PALETTE.accent,
    fontFamily: "DMMono",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: PALETTE.body,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  tag: {
    fontFamily: "DMMono",
    fontSize: 7,
    color: PALETTE.muted,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: PALETTE.border,
  },
  sideCategory: {
    fontFamily: "DMMono",
    fontSize: 7.5,
    color: PALETTE.accent,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
    marginTop: 6,
  },
  sideList: {
    fontSize: 8.5,
    color: PALETTE.body,
    lineHeight: 1.4,
  },
  timelineEntry: {
    marginBottom: 4,
  },
  timelineYear: {
    fontFamily: "DMMono",
    fontSize: 8,
    color: PALETTE.accent,
  },
  timelineLabel: {
    fontSize: 9,
    color: PALETTE.ink,
    fontWeight: 500,
  },
  timelineDesc: {
    fontSize: 8.5,
    color: PALETTE.muted,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "DMMono",
    fontSize: 7,
    color: PALETTE.muted,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: PALETTE.border,
  },
})

type Lang = "pt" | "en"

const COPY = {
  pt: {
    role: "Data Engineer · Full Stack · AI",
    location: "Registro, SP · Brasil",
    summary: "Sumário",
    summaryText:
      "Engenheiro de Dados com experiência em projetos de Data Lake corporativo em GCP, atuando em consultoria alocado em um cliente de grande porte do setor de energia. Foco em design e operação de pipelines end-to-end seguindo arquitetura medallion (Staging → Bronze → Silver → Gold) com BigQuery, Dataform, Datastream e Pub/Sub. Experiência complementar em full-stack, IA/ML aplicada (PyTorch U-Net) e cloud (AWS).",
    experience: "Experiência",
    education: "Formação",
    educationItems: [
      {
        title: "Tecnólogo em Desenvolvimento de Software Multiplataforma (DSM)",
        place: "Fatec Registro · 2023 – em andamento",
      },
      {
        title: "Técnico em Desenvolvimento de Sistemas",
        place: "ETEC · 2022",
      },
    ],
    certs: "Certificações",
    stack: "Stack técnica",
    timeline: "Trajetória",
    generated: "PDF gerado dinamicamente do mesmo conteúdo do site",
  },
  en: {
    role: "Data Engineer · Full Stack · AI",
    location: "Registro, SP · Brazil",
    summary: "Summary",
    summaryText:
      "Data Engineer with hands-on experience in enterprise Data Lake projects on GCP, working in consulting allocated to a large-scale energy sector client. Focused on designing and operating end-to-end pipelines following medallion architecture (Staging → Bronze → Silver → Gold) with BigQuery, Dataform, Datastream and Pub/Sub. Additional experience in full-stack, applied AI/ML (PyTorch U-Net) and cloud (AWS).",
    experience: "Experience",
    education: "Education",
    educationItems: [
      {
        title: "Technologist in Multiplatform Software Development (DSM)",
        place: "Fatec Registro · 2023 – ongoing",
      },
      {
        title: "Technical Degree in Systems Development",
        place: "ETEC · 2022",
      },
    ],
    certs: "Certifications",
    stack: "Technical stack",
    timeline: "Career",
    generated: "PDF generated dynamically from the same source as the site",
  },
} as const

export default function ResumeDocument({ lang }: { lang: Lang }) {
  const copy = COPY[lang]
  // Pull stack categories that matter most on a 1-page CV.
  const featuredStackCats = ["Cloud & Infraestrutura", "Transformação & Modelagem", "Linguagens & Frameworks"]
  const featuredStack = stackData.filter((c) => featuredStackCats.includes(c.category))

  // Pull certifications from the stack file (separate category there)
  const certs = stackData.find((c) => c.category === "Certificações")?.items ?? []

  return (
    <Document
      author="Marcelo Augusto Aguiar da Cruz"
      title={lang === "en" ? "Marcelo Augusto — Résumé" : "Marcelo Augusto — Currículo"}
      subject={copy.role}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Marcelo Augusto Aguiar da Cruz</Text>
          </View>
          <Text style={styles.role}>{copy.role}</Text>
          <View style={styles.contactRow}>
            <Text>{copy.location}</Text>
            <Link src="mailto:marceloaugustocge@gmail.com" style={{ color: PALETTE.muted }}>
              marceloaugustocge@gmail.com
            </Link>
            <Link src="https://www.linkedin.com/in/marcelo-augusto-oo/" style={{ color: PALETTE.muted }}>
              linkedin.com/in/marcelo-augusto-oo
            </Link>
            <Link src="https://github.com/marcelitos1v9" style={{ color: PALETTE.muted }}>
              github.com/marcelitos1v9
            </Link>
            <Link src="https://marceloaguiar.dev" style={{ color: PALETTE.muted }}>
              marceloaguiar.dev
            </Link>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>{copy.summary}</Text>
        <Text style={styles.paragraph}>{copy.summaryText}</Text>

        {/* Two-column body */}
        <View style={styles.twoCol}>
          {/* Main: experience */}
          <View style={styles.colMain}>
            <Text style={styles.sectionTitle}>{copy.experience}</Text>
            {projectsData.map((p) => {
              const role = lang === "en" ? p.role_en : p.role
              const context = lang === "en" ? p.context_en : p.context
              const bullets = lang === "en" ? p.bullets_en : p.bullets
              return (
                <View key={p.slug} style={styles.jobBlock} wrap={false}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle}>
                      {p.name} · <Text style={{ color: PALETTE.accent }}>{role}</Text>
                    </Text>
                    <Text style={styles.jobMeta}>{p.period}</Text>
                  </View>
                  <Text style={styles.jobContext}>{context}</Text>
                  {bullets.slice(0, 3).map((b, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDash}>—</Text>
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
                  <View style={styles.tagRow}>
                    {p.tags.slice(0, 6).map((tag) => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              )
            })}
          </View>

          {/* Side: education, stack, timeline */}
          <View style={styles.colSide}>
            <Text style={styles.sectionTitle}>{copy.education}</Text>
            {copy.educationItems.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 9, color: PALETTE.ink, fontWeight: 500 }}>{edu.title}</Text>
                <Text style={{ fontFamily: "DMMono", fontSize: 7.5, color: PALETTE.muted }}>
                  {edu.place}
                </Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>{copy.stack}</Text>
            {featuredStack.map((cat) => (
              <View key={cat.category} wrap={false}>
                <Text style={styles.sideCategory}>
                  {lang === "en" ? cat.category_en : cat.category}
                </Text>
                <Text style={styles.sideList}>{cat.items.map((i) => i.name).join(" · ")}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>{copy.certs}</Text>
            {certs.map((c) => (
              <Text key={c.name} style={styles.sideList}>
                · {c.name}
              </Text>
            ))}

            <Text style={styles.sectionTitle}>{copy.timeline}</Text>
            {timelineData.map((entry, i) => (
              <View key={i} style={styles.timelineEntry}>
                <Text style={styles.timelineYear}>{entry.year}</Text>
                <Text style={styles.timelineLabel}>{lang === "en" ? entry.label_en : entry.label}</Text>
                <Text style={styles.timelineDesc}>
                  {lang === "en" ? entry.description_en : entry.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{copy.generated}</Text>
          <Text>marceloaguiar.dev/cv</Text>
        </View>
      </Page>
    </Document>
  )
}
