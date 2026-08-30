# marceloaguiar.dev

Portfólio pessoal — Data Engineer & Full Stack.

Editorial-dark, animado, bilíngue (PT/EN), com foco em performance e tipografia
serifada/monoespaçada.

## Stack

- **Next.js 16** (App Router, React 19, OG images geradas no build)
- **TypeScript** estrito
- **Tailwind v4** + design tokens em CSS variables
- **Framer Motion** para transições
- **Lenis** para smooth scroll virtualizado
- **DuckDB-WASM** (em `/playground`) rodando SQL no browser, sem backend
- Custom cursor, scroll-progress, text scramble, intersection-observer
  compartilhado

## Stack do site ≠ stack do dono

A stack técnica exibida na página `/stack` (BigQuery, Dataform, Python, etc.)
descreve o trabalho do Marcelo — não é a stack usada para construir este
site. As duas coisas são independentes.

## Estrutura

```
app/
  layout.tsx              # raiz, fontes, metadata, JSON-LD
  page.tsx                # home (Hero + About + Expertise + Projects + Timeline + Contact)
  template.tsx            # transição de rota
  icon.svg                # favicon (monograma MAA)
  opengraph-image.tsx     # OG da home (bilíngue, tech-term-only)
  api/contact/route.ts    # entrega do formulário (Resend / webhook / mailto)
  cv/
    route.ts              # GET /cv?lang=pt|en → PDF
    ResumeDocument.tsx    # documento @react-pdf
  now/
    page.tsx              # /now — foco atual + atividade recente no GitHub
    NowClient.tsx
  stack/
    page.tsx              # /stack
    opengraph-image.tsx   # OG específica da página
  playground/
    page.tsx              # /playground — pipeline Medallion ao vivo (DuckDB-WASM)
    PlaygroundClient.tsx  # carrega DuckDB do CDN jsDelivr em Web Worker
    SqlEditor.tsx         # editor livre, queries compartilháveis via ?q=
    pipeline.ts           # SQL + dataset sintético de leituras de medidores
    rows.ts               # Arrow → linhas exibíveis (datas, BigInt)
    opengraph-image.tsx   # OG da página
  projects/
    [slug]/page.tsx       # uma rota por projeto, geração estática
  sitemap.ts
  robots.ts

components/
  layout/{Navbar,Footer}.tsx
  sections/{Hero,About,Expertise,Projects,Timeline,Contact}.tsx
  stack/{StackExplorer,StackPageHeader}.tsx
  ui/{LenisProvider,CustomCursor,ScrollProgress,BackToTop,Providers,
      CommandPalette,HeroParticles,KonamiCode,MermaidDiagram}.tsx

contexts/LanguageContext.tsx   # toggle PT/EN client-side, sincroniza <html lang>
hooks/{useInView,useTextScramble,useMousePosition,useMediaQuery}.ts
lib/
  data/{projects,stack,timeline,now,github}.ts   # conteúdo + fetch do GitHub
  i18n/index.ts                                  # traduções (PT/EN)
  seo/jsonLd.ts                                  # schema.org Person + projetos
public/
  fonts/                  # TTFs (DM Sans, DM Mono, Fraunces) usados no PDF
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## CV / Currículo

Gerado dinamicamente em `/cv?lang=pt|en` via `@react-pdf/renderer`. Lê
`lib/data/{projects,timeline,stack}` e i18n direto, então o PDF nunca
desincroniza do site. Sem arquivo estático em `/public/cv.pdf`.

As fontes do PDF são lidas de `public/fonts/*.ttf`, não baixadas em runtime:
as URLs do `fonts.gstatic.com` são versionadas (`/v15/`, `/v36/`) e o Google
as rotaciona, o que já derrubou a rota inteira com 500.

## Variáveis de ambiente

Todas são **opcionais** — o site roda inteiro sem nenhuma delas. Veja
`.env.example`.

| Var                     | Default                     | Uso                                          |
| ----------------------- | --------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`  | `https://marceloaguiar.dev` | URL absoluta usada em OG, JSON-LD, sitemap   |
| `GITHUB_TOKEN`          | —                           | Sobe o rate limit dos stats e do feed `/now` |
| `RESEND_API_KEY`        | —                           | Entrega o formulário por email (Resend)      |
| `CONTACT_TO`            | `marceloaugustocge@gmail.com` | Destinatário do formulário                 |
| `CONTACT_FROM`          | `Portfolio <onboarding@resend.dev>` | Remetente no Resend                |
| `CONTACT_WEBHOOK_URL`   | —                           | Alternativa ao Resend: POST do payload em JSON |

Sem `RESEND_API_KEY` nem `CONTACT_WEBHOOK_URL`, `/api/contact` responde 501 e o
formulário cai para um `mailto:` prefilled no cliente de email do visitante.

## i18n

A troca de idioma é **client-side** (sem rotas separadas) — clicar PT/EN no
header alterna o conteúdo e persiste em `localStorage`. Por isso o `hreflang`
no `<head>` aponta os dois idiomas para a mesma URL canônica.

Para adicionar uma chave de tradução:

1. Edite `lib/i18n/index.ts` (campos `pt` e `en` precisam casar — o TypeScript
   força via `typeof pt`).
2. Use `const { t } = useLanguage()` no componente.

## Acessibilidade

- Contraste do `--color-muted` ajustado para passar WCAG AA contra `--color-bg`.
- `--color-decorative` (`#3A3A3A`) reservado para linhas/ornamentos não-text.
- Cursor custom desativado em ponteiros coarse e dentro de inputs/textareas.
- `aria-label` estático no `<h1>` do Hero para não vazar caracteres do scramble
  para leitores de tela.
- `prefers-reduced-motion` desabilita Lenis e reduz transições a quase zero.

## Performance / arquitetura

- `useInView` usa **um** `IntersectionObserver` compartilhado por (threshold,
  rootMargin) — todos os reveals dividem o mesmo observer.
- OG images são pré-renderizadas no build (runtime Node, sem `runtime = "edge"`,
  que desabilitaria a geração estática e renderizaria a cada request).
- A maioria das seções é client-component porque depende do toggle de idioma.
  Movimentar pra server seria possível só com locale por URL (`/pt/...`,
  `/en/...`), o que é um refactor maior.

## Deploy

Vercel é o caminho natural — `npm run build` gera estático para tudo (incluindo
as páginas de projeto via `generateStaticParams`).

## Comandos

```bash
npm run dev     # dev server (Turbopack)
npm run build   # build de produção
npm run start   # serve o build
npm run lint    # eslint
```
