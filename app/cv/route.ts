import { NextRequest } from "next/server"
import { renderToStream } from "@react-pdf/renderer"
import ResumeDocument from "./ResumeDocument"
import React from "react"

// React-PDF uses Yoga (WASM) + Node.js streams, so we explicitly opt into
// the Node runtime — the edge runtime can't load the native bindings.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// react-pdf's renderToStream is typed to require ReactElement<DocumentProps>
// at the call site, but it actually accepts any element whose tree resolves
// to a <Document> (which ours does). We grab the expected element type
// directly from renderToStream's signature so this stays in sync if the
// library tightens its types later.
type StreamElement = Parameters<typeof renderToStream>[0]

/**
 * GET /cv?lang=pt|en → streams a freshly-rendered PDF résumé.
 *
 * The PDF is rendered from the same data files the website uses
 * (`lib/data/{projects,timeline,stack}`), so there's no chance of the
 * resume drifting from the on-screen content.
 */
export async function GET(req: NextRequest) {
  const langParam = req.nextUrl.searchParams.get("lang")
  const lang = langParam === "en" ? "en" : "pt"

  const element = React.createElement(ResumeDocument, { lang }) as unknown as StreamElement
  const stream = (await renderToStream(element)) as unknown as ReadableStream

  const filename =
    lang === "en"
      ? "Marcelo-Augusto-Aguiar-da-Cruz-Resume.pdf"
      : "Marcelo-Augusto-Aguiar-da-Cruz-Curriculo.pdf"

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      // `inline` so clicking the link opens it in a browser tab; the
      // download button on the page sets `download` to force-save.
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
