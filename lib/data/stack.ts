export type StackItem = {
  name: string
  description: string
  description_en: string
  context: string
  context_en: string
}

export type StackCategory = {
  category: string
  category_en: string
  items: StackItem[]
}

export const stackData: StackCategory[] = [
  {
    category: "Cloud & Infraestrutura",
    category_en: "Cloud & Infrastructure",
    items: [
      {
        name: "Google Cloud Platform",
        description:
          "Plataforma principal onde toda a infraestrutura do Data Lake corporativo reside — desde ingestão até consumo analítico nas camadas Bronze, Silver e Gold.",
        description_en:
          "Primary platform where the entire corporate Data Lake infrastructure resides — from ingestion through analytical consumption across Bronze, Silver, and Gold layers.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "BigQuery",
        description:
          "Data warehouse columnar para armazenamento e consulta analítica em escala. Utilizado com particionamento eficiente, clustering e window functions complexas nas camadas da medallion architecture.",
        description_en:
          "Columnar data warehouse for large-scale analytical storage and querying. Used with efficient partitioning, clustering, and complex window functions across medallion architecture layers.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "Cloud Run",
        description:
          "Execução de workers de ingestão containerizados, escalando a zero quando não há carga — viabilizando processamento serverless sem gerenciamento de infraestrutura.",
        description_en:
          "Execution of containerized ingestion workers, scaling to zero under no load — enabling serverless processing without infrastructure management.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "Pub/Sub",
        description:
          "Mensageria para eventos de ingestão em tempo real, desacoplando produtores de consumidores e garantindo entrega confiável de eventos entre sistemas.",
        description_en:
          "Messaging for real-time ingestion events, decoupling producers from consumers and ensuring reliable event delivery between systems.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "Datastream",
        description:
          "CDC (Change Data Capture) para replicação de dados relacionais com baixa latência — integrando fontes como SAP ERP e plataformas de gestão de serviços ao Data Lake.",
        description_en:
          "CDC (Change Data Capture) for low-latency relational data replication — integrating sources like SAP ERP and service management platforms into the Data Lake.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "AWS",
        description:
          "Provisionamento e manutenção de infraestrutura em serviços gerenciados AWS. Certificado Cloud Practitioner durante período de estágio.",
        description_en:
          "Provisioning and maintenance of managed AWS infrastructure. Earned Cloud Practitioner certification during internship at Compass UOL.",
        context: "Compass UOL · Estágio",
        context_en: "Compass UOL · Internship",
      },
    ],
  },
  {
    category: "Transformação & Modelagem",
    category_en: "Transformation & Modeling",
    items: [
      {
        name: "Dataform",
        description:
          "Orquestração de transformações SQL com dependency graph automático, testes de qualidade de dados e documentação de linhagem entre camadas. Principal ferramenta de ELT no pipeline.",
        description_en:
          "SQL transformation orchestration with automatic dependency graph, data quality tests, and lineage documentation across layers. Primary ELT tool in the pipeline.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "SQL (BigQuery dialect)",
        description:
          "Modelagem analítica nas camadas Bronze → Silver → Gold com CTEs complexas, window functions, partições e estratégias de incremental load. Convenções de nomenclatura por domínio de negócio.",
        description_en:
          "Analytical modeling across Bronze → Silver → Gold layers with complex CTEs, window functions, partitions, and incremental load strategies. Domain-based naming conventions.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "JavaScript UDFs",
        description:
          "Lógica de negócio que não cabe em SQL puro — como alocação FIFO multi-centro de distribuição em BigQuery. Migração de solução em planilhas para execução serverless em escala.",
        description_en:
          "Business logic that doesn't fit in pure SQL — such as multi-distribution-center FIFO allocation in BigQuery. Migration from spreadsheet solution to serverless execution at scale.",
        context: "Compass UOL · Cliente Energia",
        context_en: "Compass UOL · Energy Client",
      },
      {
        name: "dbt (conceitos)",
        description:
          "Conhecimento de modelagem semântica, testes, documentação e materialização incremental — aplicados conceitualmente na orquestração com Dataform.",
        description_en:
          "Knowledge of semantic modeling, testing, documentation, and incremental materialization — applied conceptually in orchestration with Dataform.",
        context: "Referência conceitual",
        context_en: "Conceptual reference",
      },
    ],
  },
  {
    category: "Linguagens & Frameworks",
    category_en: "Languages & Frameworks",
    items: [
      {
        name: "Python",
        description:
          "Flask APIs com autenticação JWT, processamento de áudio com PyTorch U-Net, automação de dados com Pandas e FastAPI. Linguagem principal para backends e ML aplicado.",
        description_en:
          "Flask APIs with JWT authentication, audio processing with PyTorch U-Net, data automation with Pandas and FastAPI. Primary language for backends and applied ML.",
        context: "CalmWave · separar_audio · Fatec",
        context_en: "CalmWave · separar_audio · Fatec",
      },
      {
        name: "TypeScript / JavaScript",
        description:
          "TypeScript em projetos Next.js, React e Node.js. JavaScript para UDFs no BigQuery e ferramentas como o identador-de-sql. Projetos deployed em produção via Vercel.",
        description_en:
          "TypeScript in Next.js, React, and Node.js projects. JavaScript for BigQuery UDFs and tooling. Production projects deployed via Vercel.",
        context: "Analise-Moedas-BRL · VVAI · Projetos pessoais",
        context_en: "Analise-Moedas-BRL · VVAI · Personal projects",
      },
      {
        name: "Go",
        description:
          "API REST de gestão de estoque construída em Go — explorando concorrência nativa, performance e a abordagem minimalista da linguagem para serviços de backend de alta performance.",
        description_en:
          "REST inventory management API built in Go — exploring native concurrency, performance, and the language's minimalist approach for high-performance backend services.",
        context: "estoque-api-GO · Projetos pessoais",
        context_en: "estoque-api-GO · Personal projects",
      },
      {
        name: "Kotlin / Android",
        description:
          "Desenvolvimento mobile nativo em Kotlin com Jetpack Compose e Kotlin Multiplatform (KMP) — explorando desenvolvimento Android moderno e compartilhamento de código entre plataformas.",
        description_en:
          "Native mobile development in Kotlin with Jetpack Compose and Kotlin Multiplatform (KMP) — modern Android development and cross-platform code sharing.",
        context: "CalmWave · mergeskillskmp · Fatec",
        context_en: "CalmWave · mergeskillskmp · Fatec",
      },
      {
        name: "Java / Spring Boot",
        description:
          "APIs backend com Spring Boot, seguindo padrões enterprise de estruturação com controllers, services e repositories. Experiência com ecossistema Java para backends robustos.",
        description_en:
          "Backend APIs with Spring Boot, following enterprise structuring patterns with controllers, services, and repositories. Experience with the Java ecosystem for robust backends.",
        context: "api_spring_boot · Fatec",
        context_en: "api_spring_boot · Fatec",
      },
      {
        name: "Next.js / React",
        description:
          "Frontend e fullstack com App Router, Server Components e SSR. Projetos deployed em produção — incluindo este portfolio, painel admin do CalmWave e Analise Moedas BRL.",
        description_en:
          "Frontend and fullstack with App Router, Server Components, and SSR. Production projects — including this portfolio, CalmWave's admin dashboard, and Analise Moedas BRL.",
        context: "Portfolio · CalmWave · Projetos pessoais",
        context_en: "Portfolio · CalmWave · Personal projects",
      },
    ],
  },
  {
    category: "Bancos de Dados",
    category_en: "Databases",
    items: [
      {
        name: "PostgreSQL / Supabase",
        description:
          "Banco relacional para persistência em aplicações. Supabase como Backend-as-a-service com auth integrado, realtime e storage — usado no CalmWave para usuários e histórico de sessões.",
        description_en:
          "Relational database for application persistence. Supabase as Backend-as-a-service with integrated auth, realtime, and storage — used in CalmWave for users and session history.",
        context: "CalmWave · Fatec",
        context_en: "CalmWave · Fatec",
      },
      {
        name: "MongoDB",
        description:
          "Banco documental para workloads que exigem flexibilidade de schema, como logs de eventos e dados semi-estruturados.",
        description_en:
          "Document database for workloads requiring schema flexibility, such as event logs and semi-structured data.",
        context: "Projetos acadêmicos",
        context_en: "Academic projects",
      },
    ],
  },
  {
    category: "DevOps & Infraestrutura",
    category_en: "DevOps & Infrastructure",
    items: [
      {
        name: "Docker",
        description:
          "Containerização de aplicações para garantir portabilidade e consistência entre ambientes de desenvolvimento, staging e produção.",
        description_en:
          "Application containerization ensuring portability and consistency across development, staging, and production environments.",
        context: "CalmWave · Projetos internos",
        context_en: "CalmWave · Internal projects",
      },
      {
        name: "GitHub Actions / CI/CD",
        description:
          "Pipelines de integração e entrega contínua para deploy automatizado. Utilizado no CalmWave para CI/CD na plataforma Render e em projetos internos da Compass UOL.",
        description_en:
          "Integration and continuous delivery pipelines for automated deployment. Used in CalmWave for CI/CD on Render and in internal Compass UOL projects.",
        context: "Compass UOL · CalmWave",
        context_en: "Compass UOL · CalmWave",
      },
      {
        name: "Linux",
        description:
          "Ambiente principal de desenvolvimento e operação de serviços em nuvem — shell scripting, gerenciamento de processos e administração básica de sistemas.",
        description_en:
          "Primary environment for cloud development and service operations — shell scripting, process management, and basic system administration.",
        context: "Ambiente de trabalho",
        context_en: "Work environment",
      },
    ],
  },
  {
    category: "IA & Machine Learning",
    category_en: "AI & Machine Learning",
    items: [
      {
        name: "PyTorch (U-Net)",
        description:
          "Treinamento e inferência de modelo U-Net para supressão de ruído em áudio via espectrogramas. Processamento de sinal em tempo real exposto como API REST.",
        description_en:
          "Training and inference of a U-Net model for audio noise suppression via spectrograms. Real-time signal processing exposed as a REST API.",
        context: "CalmWave · Fatec",
        context_en: "CalmWave · Fatec",
      },
      {
        name: "Whisper (ASR)",
        description:
          "Reconhecimento automático de fala (ASR) da OpenAI — aplicado em experimentos de transcrição e processamento de áudio.",
        description_en:
          "OpenAI's automatic speech recognition (ASR) — applied in transcription experiments and audio processing.",
        context: "Projetos de pesquisa",
        context_en: "Research projects",
      },
      {
        name: "LLM APIs",
        description:
          "Integração com APIs de modelos de linguagem para features de automação inteligente, geração de conteúdo e assistentes em aplicações.",
        description_en:
          "Integration with language model APIs for intelligent automation, content generation, and assistant features in applications.",
        context: "Projetos pessoais",
        context_en: "Personal projects",
      },
    ],
  },
  {
    category: "Certificações",
    category_en: "Certifications",
    items: [
      {
        name: "AWS Certified Cloud Practitioner",
        description:
          "Certificação de fundamentos em computação em nuvem AWS, cobrindo serviços core, segurança, arquitetura Well-Architected e billing. Obtida durante período de estágio na Compass UOL.",
        description_en:
          "AWS cloud computing fundamentals certification covering core services, security, Well-Architected framework, and billing. Obtained during internship at Compass UOL.",
        context: "Amazon Web Services",
        context_en: "Amazon Web Services",
      },
      {
        name: "Oracle Fusion AI Agent Studio",
        description:
          "Certificação em construção de agentes de IA com a plataforma Oracle Fusion — design de agentes, integração com APIs e automação de processos.",
        description_en:
          "Certification in building AI agents with Oracle Fusion — agent design, API integration, and process automation.",
        context: "Oracle",
        context_en: "Oracle",
      },
    ],
  },
]
