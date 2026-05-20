export type Lang = "pt" | "en"

const pt = {
  // Navbar
  nav_stack: "Stack",
  nav_contact: "Contato",
  nav_projects: "Projetos",

  // Hero
  hero_subtitle_line1: "Pipelines end-to-end em GCP. Medallion Architecture.",
  hero_subtitle_line2: "Dados brutos em ativos analíticos confiáveis.",
  hero_location: "Compass UOL · Registro, SP",
  hero_cta_primary: "Ver projetos →",
  hero_cta_primary_aria: "Ver projetos em destaque",
  hero_cta_secondary: "Ver stack",
  hero_cta_secondary_aria: "Ver stack técnica completa",
  hero_cta_cv: "Baixar CV",
  hero_cta_cv_aria: "Baixar currículo em PDF",
  hero_name_aria: "Marcelo Augusto",

  // About
  about_label: "Sobre",
  about_location: "Registro, SP — Brasil",
  about_fact_date_label: "2024 – Presente",
  about_fact_date_value: "Data Engineer · Compass UOL",
  about_fact_sector_label: "Setor",
  about_fact_sector_value: "Energia · Cliente de grande porte",
  about_fact_edu_label: "Formação",
  about_fact_edu_value: "DSM · Fatec Registro (em andamento)",
  about_fact_loc_label: "Localização",
  about_fact_loc_value: "Registro, SP — Brasil",
  about_bio1_pre: "Engenheiro de Dados com experiência em projetos de",
  about_bio1_highlight1: "Data Lake corporativo em GCP",
  about_bio1_mid: ", atuando em consultoria alocado em um cliente de grande porte do",
  about_bio1_highlight2: "setor de energia",
  about_bio1_post: ". Foco em design e operação de pipelines end-to-end seguindo arquitetura medallion — Staging → Bronze → Silver → Gold.",
  about_bio2_pre: "No dia a dia: ingestão em tempo real via Datastream e Pub/Sub integrando fontes como",
  about_bio2_h1: "SAP ERP",
  about_bio2_mid: ", modelagem analítica em",
  about_bio2_h2: "BigQuery",
  about_bio2_mid2: "e orquestração de transformações SQL e JavaScript UDFs via",
  about_bio2_h3: "Dataform",
  about_bio2_post: ".",
  about_bio3:
    "Experiência complementar em aplicações full-stack, soluções de IA/ML aplicadas ao processamento de áudio com PyTorch, e cloud engineering em AWS. Cursando Tecnólogo em Desenvolvimento de Software Multiplataforma (DSM) pela Fatec Registro.",

  // Expertise
  expertise_label: "Expertise",
  expertise_heading: "Medallion Architecture",
  expertise_scroll: "← deslize →",
  expertise_ingestion: "Ingestão",
  expertise_staging: "Staging",
  expertise_bronze: "Bronze",
  expertise_silver: "Silver",
  expertise_gold: "Gold",

  // Timeline
  timeline_label: "Trajetória",
  timeline_heading: "Marcos de carreira",
  timeline_expand_aria: "Mostrar detalhes",
  timeline_collapse_aria: "Ocultar detalhes",

  // Projects
  projects_label: "Projetos",
  projects_heading: "Trabalho que ficou em produção.",
  projects_view: "Ver projeto ↗",
  projects_github: "GitHub ↗",
  projects_detail_link: "Ver detalhe completo →",
  project_back: "← Voltar para projetos",

  // Contact
  contact_heading: "Vamos conversar.",
  contact_body: "Se você tem um desafio de dados interessante, estou disponível para conversar.",
  contact_copied: "Copiado ✓",
  contact_copy_aria_default: "Copiar endereço de email",
  contact_copy_aria_done: "Email copiado!",
  contact_cv: "Baixar CV ↓",
  contact_cv_aria: "Baixar currículo em PDF",

  // Stack page
  stack_label: "/stack",
  stack_heading: "Stack técnica.",
  stack_tab_list: "Tecnologias",
  stack_tab_detail: "Detalhe",
  stack_back: "← Voltar",
  stack_search_placeholder: "Buscar tecnologias…",
  stack_search_aria: "Buscar na stack",
  stack_no_results: "Nenhuma tecnologia encontrada",
  stack_results_count: (n: number) =>
    n === 1 ? "1 resultado" : `${n} resultados`,

  // BackToTop
  backtotop_aria: "Voltar ao topo",
}

const en: typeof pt = {
  nav_stack: "Stack",
  nav_contact: "Contact",
  nav_projects: "Projects",

  hero_subtitle_line1: "End-to-end pipelines on GCP. Medallion Architecture.",
  hero_subtitle_line2: "Raw data into reliable analytical assets.",
  hero_location: "Compass UOL · Registro, SP, Brazil",
  hero_cta_primary: "View projects →",
  hero_cta_primary_aria: "View featured projects",
  hero_cta_secondary: "View stack",
  hero_cta_secondary_aria: "View full technical stack",
  hero_cta_cv: "Download CV",
  hero_cta_cv_aria: "Download résumé as PDF",
  hero_name_aria: "Marcelo Augusto",

  about_label: "About",
  about_location: "Registro, SP — Brazil",
  about_fact_date_label: "2024 – Present",
  about_fact_date_value: "Data Engineer · Compass UOL",
  about_fact_sector_label: "Industry",
  about_fact_sector_value: "Energy · Large-scale Client",
  about_fact_edu_label: "Education",
  about_fact_edu_value: "DSM · Fatec Registro (ongoing)",
  about_fact_loc_label: "Location",
  about_fact_loc_value: "Registro, SP — Brazil",
  about_bio1_pre: "Data Engineer with hands-on experience in enterprise",
  about_bio1_highlight1: "Data Lake projects on GCP",
  about_bio1_mid: ", working in consulting allocated to a large-scale",
  about_bio1_highlight2: "energy sector",
  about_bio1_post:
    " client. Focused on designing and operating end-to-end pipelines following medallion architecture — Staging → Bronze → Silver → Gold.",
  about_bio2_pre:
    "Day-to-day: real-time ingestion via Datastream and Pub/Sub integrating sources such as",
  about_bio2_h1: "SAP ERP",
  about_bio2_mid: ", analytical modeling in",
  about_bio2_h2: "BigQuery",
  about_bio2_mid2: "and SQL and JavaScript UDF transformations orchestrated via",
  about_bio2_h3: "Dataform",
  about_bio2_post: ".",
  about_bio3:
    "Additional experience in full-stack applications, AI/ML solutions applied to audio processing with PyTorch, and cloud engineering on AWS. Currently pursuing a degree in Multiplatform Software Development (DSM) at Fatec Registro.",

  expertise_label: "Expertise",
  expertise_heading: "Medallion Architecture",
  expertise_scroll: "← swipe →",
  expertise_ingestion: "Ingestion",
  expertise_staging: "Staging",
  expertise_bronze: "Bronze",
  expertise_silver: "Silver",
  expertise_gold: "Gold",

  timeline_label: "Career",
  timeline_heading: "Career milestones",
  timeline_expand_aria: "Show details",
  timeline_collapse_aria: "Hide details",

  projects_label: "Projects",
  projects_heading: "Work that shipped to production.",
  projects_view: "View project ↗",
  projects_github: "GitHub ↗",
  projects_detail_link: "View full detail →",
  project_back: "← Back to projects",

  contact_heading: "Let's talk.",
  contact_body: "If you have an interesting data challenge, I'm available to connect.",
  contact_copied: "Copied ✓",
  contact_copy_aria_default: "Copy email address",
  contact_copy_aria_done: "Email copied!",
  contact_cv: "Download CV ↓",
  contact_cv_aria: "Download résumé as PDF",

  stack_label: "/stack",
  stack_heading: "Technical stack.",
  stack_tab_list: "Technologies",
  stack_tab_detail: "Detail",
  stack_back: "← Back",
  stack_search_placeholder: "Search technologies…",
  stack_search_aria: "Search stack",
  stack_no_results: "No technologies found",
  stack_results_count: (n: number) =>
    n === 1 ? "1 result" : `${n} results`,

  backtotop_aria: "Back to top",
}

export const i18n = { pt, en }
export type Translations = typeof pt
