// "Now page" content — inspired by nownownow.com. Update this file
// whenever your focus shifts; it's the only source of truth.

export const NOW_UPDATED_AT = "2026-05-20"

export type NowItem = {
  /** Optional short tag shown to the left, e.g. "WORK", "LEARNING". */
  tag?: string
  pt: string
  en: string
}

export const NOW_SECTIONS: { title_pt: string; title_en: string; items: NowItem[] }[] = [
  {
    title_pt: "Trabalho",
    title_en: "Work",
    items: [
      {
        tag: "DATA LAKE",
        pt: "Migrando o pipeline FIFO multi-CD para versão totalmente serverless em Dataform — finalizando os testes de regressão.",
        en: "Migrating the multi-CD FIFO pipeline to a fully serverless Dataform setup — wrapping up regression tests.",
      },
      {
        tag: "MEDALLION",
        pt: "Refinando a camada Silver com window functions mais agressivas para reduzir o custo de query do BI.",
        en: "Refining the Silver layer with more aggressive window functions to cut BI query costs.",
      },
    ],
  },
  {
    title_pt: "Estudando",
    title_en: "Learning",
    items: [
      {
        tag: "GO",
        pt: "Lendo \"100 Go Mistakes and How to Avoid Them\" — focando em concorrência idiomática.",
        en: "Reading \"100 Go Mistakes and How to Avoid Them\" — focusing on idiomatic concurrency.",
      },
      {
        tag: "ML",
        pt: "Revisitando fundamentos de processamento de sinais (FFT, espectrogramas) para um experimento de áudio.",
        en: "Revisiting signal-processing fundamentals (FFT, spectrograms) for an audio experiment.",
      },
    ],
  },
  {
    title_pt: "Side projects",
    title_en: "Side projects",
    items: [
      {
        tag: "LLM",
        pt: "Integrando a Groq SDK pra adicionar um chat de FAQ neste portfolio (sem custo, free tier).",
        en: "Wiring up the Groq SDK to add a FAQ chat on this portfolio (zero cost, free tier).",
      },
    ],
  },
  {
    title_pt: "Fora da tela",
    title_en: "Off-screen",
    items: [
      {
        pt: "Caminhadas na trilha do Parque Estadual da Serra do Mar — equilíbrio entre tela e mata atlântica.",
        en: "Hikes through the Serra do Mar State Park — balance between screens and the Atlantic Forest.",
      },
    ],
  },
]
