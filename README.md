# marceloaguiar.dev

Portfólio pessoal — Data Engineer & Full Stack.

Editorial-dark, animado, bilíngue (PT/EN), com foco em performance e tipografia
serifada/monoespaçada.

## Stack

- **Next.js 16** (App Router, React 19, edge runtime para OG images)
- **TypeScript** estrito
- **Tailwind v4** + design tokens em CSS variables
- **Framer Motion** para transições
- **Lenis** para smooth scroll virtualizado
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
  opengraph-image.tsx     # OG da home (bilíngue, tech-term-only)
  stack/
    page.tsx              # /stack
    opengraph-image.tsx   # OG específica da página
  projects/
    [slug]/page.tsx       # uma rota por projeto, geração estática
  sitemap.ts
  robots.ts

components/
  layout/Navbar.tsx
  sections/{Hero,About,Expertise,Projects,Timeline,Contact}.tsx
  stack/{StackExplorer,StackPageHeader}.tsx
  ui/{LenisProvider,CustomCursor,ScrollProgress,BackToTop,Providers}.tsx

contexts/LanguageContext.tsx   # toggle PT/EN client-side, sincroniza <html lang>
hooks/{useInView,useTextScramble,useMousePosition}.ts
lib/
  data/{projects,stack,timeline}.ts   # conteúdo
  i18n/index.ts                       # traduções (PT/EN)
  seo/jsonLd.ts                       # schema.org Person + projetos
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Assets que você precisa fornecer

Coloque em `/public`:

- `cv.pdf` — currículo apontado pelos botões "Download CV" no Hero e Contact.
- (Opcional) `favicon.ico` — já existe um padrão Next.

## Variáveis de ambiente

| Var                      | Default                    | Uso                                      |
| ------------------------ | -------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`   | `https://marceloaguiar.dev` | URL absoluta usada em OG, JSON-LD, sitemap |

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
- OG images são geradas no edge (`runtime = "edge"`).
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
