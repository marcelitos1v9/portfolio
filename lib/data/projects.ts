export type ProjectEntry = {
  index: string
  name: string
  role: string
  role_en: string
  period: string
  context: string
  context_en: string
  summary: string
  summary_en: string
  bullets: string[]
  bullets_en: string[]
  tags: string[]
  link?: string
  repo?: string
}

export const projectsData: ProjectEntry[] = [
  {
    index: "01",
    name: "CalmWave",
    role: "Co-fundador · Engenheiro de Software",
    role_en: "Co-founder · Software Engineer",
    period: "2023 – Presente",
    context: "vvAi Startup · Tecnologia Assistiva",
    context_en: "vvAi Startup · Assistive Technology",
    summary:
      "Startup de tecnologia assistiva para crianças com TPAC (Transtorno do Processamento Auditivo Central) — plataforma completa com app mobile Android, microserviço de processamento de áudio com IA, painel administrativo e landing page em produção.",
    summary_en:
      "Assistive technology startup for children with CAPD (Central Auditory Processing Disorder) — a complete platform with an Android mobile app, AI-powered audio processing microservice, administrative dashboard, and landing page, all in production.",
    bullets: [
      "App Android em Kotlin + Jetpack Compose: interface para crianças com exercícios auditivos e sessões guiadas",
      "Microserviço Python de processamento de áudio com modelo U-Net (PyTorch) para supressão de ruído e fala adaptada",
      "Painel administrativo (Next.js) para terapeutas e responsáveis acompanharem progresso — em produção",
      "Landing page institucional em produção com apresentação do produto e onboarding",
      "Arquitetura multi-repositório na org vvAi-Startup; CI/CD via GitHub Actions com deploys na Vercel e Render",
    ],
    bullets_en: [
      "Android app in Kotlin + Jetpack Compose: interface for children with auditory exercises and guided sessions",
      "Python audio processing microservice with a U-Net model (PyTorch) for noise suppression and adapted speech",
      "Admin dashboard (Next.js) for therapists and caregivers to track progress — in production",
      "Institutional landing page in production with product presentation and onboarding",
      "Multi-repository architecture under the vvAi-Startup org; CI/CD via GitHub Actions with Vercel and Render deployments",
    ],
    tags: ["Kotlin", "Jetpack Compose", "Python", "PyTorch", "FastAPI", "Next.js", "Vercel", "Android"],
    link: "https://calmwave-landingpage.vercel.app",
    repo: "https://github.com/vvAi-Startup",
  },
  {
    index: "02",
    name: "Pipeline FIFO Multi-CD",
    role: "Data Engineer",
    role_en: "Data Engineer",
    period: "2024 – 2025",
    context: "Compass UOL · Cliente Energia · Confidencial",
    context_en: "Compass UOL · Energy Client · Confidential",
    summary:
      "Reestruturação de pipeline crítico de alocação logística FIFO para múltiplos centros de distribuição — migração de automação em planilhas para arquitetura serverless escalável em BigQuery.",
    summary_en:
      "Redesign of a critical FIFO logistics allocation pipeline for multiple distribution centers — migrating from spreadsheet automation to a scalable serverless architecture in BigQuery.",
    bullets: [
      "Mapeamento e documentação das regras de negócio FIFO para múltiplos centros de distribuição",
      "Migração de automação frágil em Excel para arquitetura SQL + JavaScript UDF no BigQuery via Dataform",
      "Execução serverless eliminou dependência de ambiente desktop e processamento manual recorrente",
      "Dependency graph do Dataform com testes de qualidade automatizados e rastreabilidade completa de linhagem",
      "Processo antes propenso a erro passou a rodar em escala com auditabilidade e zero intervenção manual",
    ],
    bullets_en: [
      "Mapping and documentation of FIFO business rules for multiple distribution centers",
      "Migration from fragile Excel automation to SQL + JavaScript UDF architecture in BigQuery via Dataform",
      "Serverless execution eliminated dependency on desktop environment and recurring manual processing",
      "Dataform dependency graph with automated data quality tests and full lineage traceability",
      "Error-prone process now runs at scale with auditability and zero manual intervention",
    ],
    tags: ["BigQuery", "Dataform", "SQL", "JavaScript UDFs", "GCP", "Medallion Architecture"],
  },
  {
    index: "03",
    name: "Analise Moedas BRL",
    role: "Desenvolvedor Full Stack",
    role_en: "Full Stack Developer",
    period: "2024",
    context: "Projeto pessoal · Em produção",
    context_en: "Personal project · In production",
    summary:
      "Dashboard interativo de análise de câmbio em tempo real — cotações de múltiplas moedas em relação ao Real, com visualização histórica e comparativo.",
    summary_en:
      "Interactive real-time exchange rate analysis dashboard — quotes for multiple currencies against the Brazilian Real, with historical visualization and comparison.",
    bullets: [
      "Consumo de API de câmbio com atualização em tempo real das cotações",
      "Interface construída em TypeScript com visualizações de dados interativas",
      "Deploy contínuo na Vercel com preview por pull request",
      "Aplicação em produção acessível publicamente",
    ],
    bullets_en: [
      "Exchange rate API consumption with real-time quote updates",
      "Interface built in TypeScript with interactive data visualizations",
      "Continuous deployment on Vercel with pull request previews",
      "Publicly accessible production application",
    ],
    tags: ["TypeScript", "React", "API REST", "Vercel"],
    link: "https://analise-moedas-brl.vercel.app",
    repo: "https://github.com/marcelitos1v9/Analise-Moedas-BRL",
  },
  {
    index: "04",
    name: "separar_audio",
    role: "Engenheiro de ML",
    role_en: "ML Engineer",
    period: "2025",
    context: "Projeto pessoal · Python · Open Source",
    context_en: "Personal project · Python · Open Source",
    summary:
      "Ferramenta Python de separação de fontes de áudio — isola vocais, instrumentos e ruído em faixas independentes a partir de um arquivo de entrada.",
    summary_en:
      "Python audio source separation tool — isolates vocals, instruments, and noise into independent tracks from an input file.",
    bullets: [
      "Separação de fontes de áudio usando técnicas de processamento de sinal e modelos de ML",
      "Suporte a múltiplos formatos de áudio com conversão automática via converter_wav (projeto auxiliar)",
      "Interface de linha de comando simples e pipeline configurável por parâmetros",
      "Projeto com 1 fork externo — sinal de uso real por terceiros",
    ],
    bullets_en: [
      "Audio source separation using signal processing techniques and ML models",
      "Support for multiple audio formats with automatic conversion via converter_wav (auxiliary project)",
      "Simple command-line interface with configurable pipeline parameters",
      "Project with 1 external fork — signal of real third-party usage",
    ],
    tags: ["Python", "Audio ML", "Signal Processing", "Open Source"],
    repo: "https://github.com/marcelitos1v9/separar_audio",
  },
  {
    index: "05",
    name: "Estoque API (Go)",
    role: "Desenvolvedor Backend",
    role_en: "Backend Developer",
    period: "2025",
    context: "Projeto pessoal · Go",
    context_en: "Personal project · Go",
    summary:
      "API REST de gestão de estoque construída em Go — explorando concorrência nativa, performance e minimalismo de uma linguagem compilada para serviços de backend.",
    summary_en:
      "REST inventory management API built in Go — exploring native concurrency, performance, and the minimalist approach of a compiled language for backend services.",
    bullets: [
      "API REST completa com CRUD de produtos, categorias e movimentações de estoque",
      "Go escolhido pelo desempenho e concorrência nativa — diferencial em relação ao ecossistema Python/Node",
      "Arquitetura limpa com separação de handlers, serviços e repositório de dados",
      "Exploração prática do ecossistema Go para serviços de backend de alta performance",
    ],
    bullets_en: [
      "Complete REST API with CRUD for products, categories, and inventory movements",
      "Go chosen for its performance and native concurrency — a differentiator from the Python/Node ecosystem",
      "Clean architecture with separation of handlers, services, and data repository",
      "Practical exploration of the Go ecosystem for high-performance backend services",
    ],
    tags: ["Go", "REST API", "Backend", "Concorrência"],
    repo: "https://github.com/marcelitos1v9/estoque-api-GO",
  },
  {
    index: "06",
    name: "Plataforma Imobiliária",
    role: "Gerente de Produto",
    role_en: "Product Manager",
    period: "2023",
    context: "Laboratório de Práticas · Fatec / Bortone Imobiliária",
    context_en: "Practice Laboratory · Fatec / Bortone Real Estate",
    summary:
      "Liderança do ciclo completo de desenvolvimento de plataforma web para um cliente real do setor imobiliário — da descoberta de requisitos até a entrega final.",
    summary_en:
      "Led the full development cycle of a web platform for a real client in the real estate sector — from requirements discovery through final delivery.",
    bullets: [
      "Gestão de equipe multidisciplinar de 12 pessoas (dev, design, UX)",
      "Levantamento e refinamento de requisitos diretamente com o cliente (Bortone Imobiliária)",
      "Gerenciamento de backlog, sprints e entregas em modelo ágil com cerimônias Scrum",
      "Ponte entre necessidades de negócio do cliente e capacidade técnica da equipe",
      "Entrega dentro do prazo com validação do cliente em demonstrações iterativas",
    ],
    bullets_en: [
      "Led a multidisciplinary team of 12 people (dev, design, UX)",
      "Requirements gathering and refinement directly with the client (Bortone Real Estate)",
      "Backlog, sprint, and delivery management in agile model with Scrum ceremonies",
      "Bridge between client business needs and team technical capacity",
      "On-time delivery with client validation in iterative demonstrations",
    ],
    tags: ["Product Management", "Agile", "Scrum", "Team Leadership"],
  },
]
