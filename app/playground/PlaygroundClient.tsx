"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { STEPS, type Step, type StepKey } from "./pipeline"

// Async-only types — runtime is dynamically imported so the ~5MB SDK is
// code-split out of the main bundle.
type AsyncDuckDB = import("@duckdb/duckdb-wasm").AsyncDuckDB
type AsyncDuckDBConnection = import("@duckdb/duckdb-wasm").AsyncDuckDBConnection

type DbStatus = "idle" | "loading" | "ready" | "error"
type StepStatus = "idle" | "running" | "done" | "error"

type Row = Record<string, unknown>

/**
 * Initializes DuckDB-WASM from the jsDelivr CDN bundle (no bundler config
 * needed, no .wasm assets to host). The MVP bundle is selected automatically
 * when the browser lacks SharedArrayBuffer/cross-origin-isolation, so this
 * works without setting COOP/COEP response headers.
 */
async function initDuckDB(): Promise<AsyncDuckDB> {
  const duckdb = await import("@duckdb/duckdb-wasm")
  const bundles = duckdb.getJsDelivrBundles()
  const bundle = await duckdb.selectBundle(bundles)

  // Wrap the CDN worker script in a same-origin Blob so the Worker
  // constructor doesn't trip on cross-origin restrictions.
  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], { type: "text/javascript" })
  )
  const worker = new Worker(workerUrl)
  const logger = new duckdb.ConsoleLogger()
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  URL.revokeObjectURL(workerUrl)
  return db
}

async function runQuery(conn: AsyncDuckDBConnection, sql: string): Promise<Row[]> {
  const result = await conn.query(sql)
  return result.toArray().map((r) => {
    const obj = r.toJSON() as Record<string, unknown>
    // Apache Arrow returns BigInt / Date instances — stringify for display.
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (typeof v === "bigint") obj[k] = Number(v)
      else if (v instanceof Date) obj[k] = v.toISOString()
    }
    return obj
  })
}

export default function PlaygroundClient() {
  const { t, lang } = useLanguage()
  const dbRef = useRef<AsyncDuckDB | null>(null)
  const connRef = useRef<AsyncDuckDBConnection | null>(null)

  const [dbStatus, setDbStatus] = useState<DbStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState<StepKey>("staging")
  const [stepStatus, setStepStatus] = useState<Record<StepKey, StepStatus>>({
    staging: "idle",
    bronze: "idle",
    silver: "idle",
    gold: "idle",
  })
  const [previews, setPreviews] = useState<Record<StepKey, Row[]>>({
    staging: [],
    bronze: [],
    silver: [],
    gold: [],
  })
  const [executionMs, setExecutionMs] = useState<Record<StepKey, number | null>>({
    staging: null,
    bronze: null,
    silver: null,
    gold: null,
  })

  /** Load DuckDB + seed Staging on mount. */
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setDbStatus("loading")
      try {
        const db = await initDuckDB()
        if (cancelled) {
          await db.terminate()
          return
        }
        dbRef.current = db
        const conn = await db.connect()
        connRef.current = conn

        // Seed staging immediately so the user has something to look at.
        const stagingStep = STEPS[0]
        const t0 = performance.now()
        await conn.query(stagingStep.sql)
        const rows = await runQuery(conn, stagingStep.previewSql)
        const t1 = performance.now()

        if (cancelled) return
        setPreviews((p) => ({ ...p, staging: rows }))
        setStepStatus((s) => ({ ...s, staging: "done" }))
        setExecutionMs((e) => ({ ...e, staging: t1 - t0 }))
        setDbStatus("ready")
      } catch (err) {
        if (cancelled) return
        console.error("[playground] init failed:", err)
        setErrorMessage(err instanceof Error ? err.message : String(err))
        setDbStatus("error")
      }
    })()

    return () => {
      cancelled = true
      const conn = connRef.current
      const db = dbRef.current
      connRef.current = null
      dbRef.current = null
      conn?.close().catch(() => {})
      db?.terminate().catch(() => {})
    }
  }, [])

  const runStep = useCallback(
    async (step: Step) => {
      const conn = connRef.current
      if (!conn) return
      setStepStatus((s) => ({ ...s, [step.key]: "running" }))
      try {
        const t0 = performance.now()
        await conn.query(step.sql)
        const rows = await runQuery(conn, step.previewSql)
        const t1 = performance.now()
        setPreviews((p) => ({ ...p, [step.key]: rows }))
        setExecutionMs((e) => ({ ...e, [step.key]: t1 - t0 }))
        setStepStatus((s) => ({ ...s, [step.key]: "done" }))
      } catch (err) {
        console.error(`[playground] step ${step.key} failed:`, err)
        setStepStatus((s) => ({ ...s, [step.key]: "error" }))
      }
    },
    []
  )

  /** Run the whole pipeline in sequence, focusing the active card on each step. */
  const runPipeline = useCallback(async () => {
    for (const step of STEPS.slice(1)) {
      setActiveKey(step.key)
      // tiny pause to let the active card transition before the SQL "runs"
      await new Promise((r) => setTimeout(r, 250))
      await runStep(step)
    }
  }, [runStep])

  const reset = useCallback(async () => {
    const conn = connRef.current
    if (!conn) return
    // Drop derived tables and re-seed staging.
    await conn.query(`
      DROP TABLE IF EXISTS gold_consumption_by_site;
      DROP TABLE IF EXISTS silver_meter_consumption;
      DROP TABLE IF EXISTS bronze_meter_readings;
    `)
    const staging = STEPS[0]
    await conn.query(staging.sql)
    const rows = await runQuery(conn, staging.previewSql)
    setPreviews({ staging: rows, bronze: [], silver: [], gold: [] })
    setStepStatus({ staging: "done", bronze: "idle", silver: "idle", gold: "idle" })
    setExecutionMs({ staging: null, bronze: null, silver: null, gold: null })
    setActiveKey("staging")
  }, [])

  const allDone = STEPS.every((s) => stepStatus[s.key] === "done")
  const activeStep = STEPS.find((s) => s.key === activeKey)!
  const activePreview = previews[activeKey]
  const activeStatus = stepStatus[activeKey]
  const activeMs = executionMs[activeKey]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="label-mono" style={{ display: "block", marginBottom: "0.75rem" }}>
          /playground
        </span>
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 300,
            color: "var(--color-heading)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            marginBottom: "1.25rem",
          }}
        >
          {lang === "en" ? "Pipeline, in your browser." : "Pipeline, no seu browser."}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            color: "var(--color-body)",
            lineHeight: 1.7,
            maxWidth: 720,
          }}
        >
          {lang === "en"
            ? "DuckDB-WASM running entirely on your machine — no backend, no API key, no cost. A full Medallion pipeline (Staging → Bronze → Silver → Gold) over synthetic meter-reading data."
            : "DuckDB-WASM rodando 100% no seu browser — sem backend, sem chave de API, sem custo. Um pipeline Medallion completo (Staging → Bronze → Silver → Gold) sobre dados sintéticos de leitura de medidores."}
        </p>
      </div>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem 1.5rem",
          padding: "0.85rem 1rem",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          marginBottom: "2rem",
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
        }}
      >
        <StatusPill status={dbStatus} lang={lang} />
        <button
          onClick={runPipeline}
          disabled={dbStatus !== "ready" || allDone}
          style={ctaButton(dbStatus !== "ready" || allDone)}
        >
          {lang === "en" ? "▶ Run pipeline" : "▶ Rodar pipeline"}
        </button>
        <button
          onClick={reset}
          disabled={dbStatus !== "ready"}
          style={ghostButton(dbStatus !== "ready")}
        >
          {lang === "en" ? "↺ Reset" : "↺ Resetar"}
        </button>
        <span
          aria-live="polite"
          style={{ marginLeft: "auto", color: "var(--color-muted)", fontSize: "0.7rem" }}
        >
          {dbStatus === "error" && errorMessage}
        </span>
      </div>

      {/* Pipeline cards (horizontal scroll on mobile, like Expertise) */}
      <div
        className="hide-scrollbar"
        style={{ overflowX: "auto", paddingBottom: "1rem", marginBottom: "1.5rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "0.5rem",
            minWidth: "min-content",
          }}
        >
          {STEPS.map((step, i) => (
            <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
              <StepCard
                step={step}
                status={stepStatus[step.key]}
                active={activeKey === step.key}
                onClick={() => setActiveKey(step.key)}
                lang={lang}
              />
              {i < STEPS.length - 1 && <Arrow done={stepStatus[STEPS[i + 1].key] === "done"} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step description */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.95rem",
          color: "var(--color-body)",
          lineHeight: 1.7,
          maxWidth: 720,
          marginBottom: "1.5rem",
        }}
      >
        {lang === "en" ? activeStep.description_en : activeStep.description}
      </p>

      {/* SQL + data side-by-side, stack on mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "1.5rem",
        }}
        className="playground-grid"
      >
        <SqlBlock sql={activeStep.sql} />
        <DataPreview
          rows={activePreview}
          status={activeStatus}
          executionMs={activeMs}
          lang={lang}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          color: "var(--color-muted)",
          marginTop: "2rem",
          letterSpacing: "0.05em",
          lineHeight: 1.7,
          maxWidth: 720,
        }}
      >
        {lang === "en"
          ? "Stack: DuckDB-WASM (Apache 2.0) loaded via jsDelivr CDN · Web Worker thread · ~12 MB downloaded on first visit · all SQL runs on your CPU, none of it leaves the tab."
          : "Stack: DuckDB-WASM (Apache 2.0) carregado via CDN jsDelivr · Web Worker · ~12 MB baixados na primeira visita · todo o SQL roda na sua CPU, nada sai dessa aba."}
      </p>

      <style>{`
        @media (max-width: 768px) {
          .playground-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function StatusPill({ status, lang }: { status: DbStatus; lang: string }) {
  const PT = { idle: "Aguardando", loading: "Carregando DuckDB…", ready: "Pronto", error: "Erro" }
  const EN = { idle: "Waiting", loading: "Loading DuckDB…", ready: "Ready", error: "Error" }
  const label = (lang === "en" ? EN : PT)[status]
  const dot =
    status === "ready"
      ? "var(--color-accent)"
      : status === "error"
        ? "#ff6b6b"
        : "var(--color-muted)"
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dot,
          animation: status === "loading" ? "pulse 1.2s ease-in-out infinite" : "none",
        }}
      />
      <span style={{ color: "var(--color-heading)" }}>{label}</span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </span>
  )
}

function StepCard({
  step,
  status,
  active,
  onClick,
  lang,
}: {
  step: Step
  status: StepStatus
  active: boolean
  onClick: () => void
  lang: string
}) {
  const PT = { idle: "Pendente", running: "Executando…", done: "Concluído", error: "Erro" }
  const EN = { idle: "Pending", running: "Running…", done: "Done", error: "Error" }
  const statusLabel = (lang === "en" ? EN : PT)[status]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: "clamp(160px, 22vw, 220px)",
        padding: "1.25rem",
        background: active ? "var(--color-surface)" : "transparent",
        border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
        textAlign: "left",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "border-color 0.2s, background 0.2s, opacity 0.2s",
        opacity: status === "idle" && !active ? 0.6 : 1,
        color: "inherit",
        fontFamily: "inherit",
        minHeight: 120,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          right: -1,
          height: 2,
          background: step.layerColor,
          transformOrigin: "left",
          transform: status === "done" ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: step.layerColor,
          marginBottom: "0.5rem",
        }}
      >
        {step.label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          color: "var(--color-muted)",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background:
              status === "done"
                ? "var(--color-accent)"
                : status === "running"
                  ? step.layerColor
                  : status === "error"
                    ? "#ff6b6b"
                    : "var(--color-decorative)",
            animation: status === "running" ? "pulse 1.2s ease-in-out infinite" : "none",
          }}
        />
        {statusLabel}
      </div>
    </button>
  )
}

function Arrow({ done }: { done: boolean }) {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" fill="none" aria-hidden="true">
      <line
        x1="0"
        y1="7"
        x2="20"
        y2="7"
        stroke={done ? "var(--color-accent)" : "var(--color-decorative)"}
        strokeWidth="1"
        style={{ transition: "stroke 0.3s ease" }}
      />
      <polyline
        points="16,3 24,7 16,11"
        stroke={done ? "var(--color-accent)" : "var(--color-decorative)"}
        strokeWidth="1"
        fill="none"
        style={{ transition: "stroke 0.3s ease" }}
      />
    </svg>
  )
}

const SQL_KEYWORDS =
  /\b(CREATE|OR|REPLACE|TABLE|AS|SELECT|FROM|WHERE|AND|OR|NOT|NULL|IS|INSERT|INTO|VALUES|CAST|TRY_CAST|WITH|PARTITION|BY|OVER|ORDER|GROUP|JOIN|LEFT|INNER|RIGHT|ON|CASE|WHEN|THEN|ELSE|END|DISTINCT|COUNT|SUM|AVG|MIN|MAX|ROUND|DATE_TRUNC|DATE_DIFF|LAG|ROW_NUMBER|CURRENT_TIMESTAMP|DROP|IF|EXISTS|VARCHAR|DOUBLE|TIMESTAMP|BIGINT|INTEGER)\b/g
const SQL_COMMENT = /(--[^\n]*)/g
const SQL_STRING = /('[^']*')/g

function highlightSQL(sql: string): React.ReactNode {
  // Token-based highlighter that avoids dangerouslySetInnerHTML.
  // Precedence: comments → strings → keywords. Each pass walks the previous
  // list of plain-text tokens, splits on regex matches, and replaces
  // matching slices with typed tokens.
  let tokens: { type: "c" | "s" | "k" | "t"; value: string }[] = [{ type: "t", value: sql }]

  const split = (re: RegExp, type: "c" | "s" | "k") => {
    const next: typeof tokens = []
    for (const tok of tokens) {
      if (tok.type !== "t") {
        next.push(tok)
        continue
      }
      let last = 0
      const text = tok.value
      let m: RegExpExecArray | null
      re.lastIndex = 0
      while ((m = re.exec(text))) {
        if (m.index > last) next.push({ type: "t", value: text.slice(last, m.index) })
        next.push({ type, value: m[0] })
        last = m.index + m[0].length
      }
      if (last < text.length) next.push({ type: "t", value: text.slice(last) })
    }
    tokens = next
  }
  split(SQL_COMMENT, "c")
  split(SQL_STRING, "s")
  split(SQL_KEYWORDS, "k")

  return tokens.map((tok, i) => {
    if (tok.type === "c")
      return (
        <span key={i} style={{ color: "var(--color-muted)" }}>
          {tok.value}
        </span>
      )
    if (tok.type === "s")
      return (
        <span key={i} style={{ color: "var(--color-body)" }}>
          {tok.value}
        </span>
      )
    if (tok.type === "k")
      return (
        <span key={i} style={{ color: "var(--color-accent)" }}>
          {tok.value}
        </span>
      )
    return <span key={i}>{tok.value}</span>
  })
}

function SqlBlock({ sql }: { sql: string }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        padding: "1rem",
        overflowX: "auto",
        maxHeight: 480,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          marginBottom: "0.75rem",
        }}
      >
        SQL
      </div>
      <pre
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.78rem",
          lineHeight: 1.6,
          color: "var(--color-heading)",
          whiteSpace: "pre",
          margin: 0,
        }}
      >
        {highlightSQL(sql)}
      </pre>
    </div>
  )
}

function DataPreview({
  rows,
  status,
  executionMs,
  lang,
}: {
  rows: Row[]
  status: StepStatus
  executionMs: number | null
  lang: string
}) {
  const columns = rows.length > 0 ? Object.keys(rows[0]) : []
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        padding: "1rem",
        maxHeight: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          {lang === "en" ? "Result" : "Resultado"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.65rem",
            color: "var(--color-muted)",
          }}
        >
          {rows.length} {lang === "en" ? "rows" : "linhas"}
          {executionMs !== null && ` · ${executionMs.toFixed(1)}ms`}
        </span>
      </div>

      <div style={{ overflow: "auto", flex: 1 }}>
        <AnimatePresence mode="wait">
          {status === "running" ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "2rem",
                textAlign: "center",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                color: "var(--color-muted)",
              }}
            >
              {lang === "en" ? "Executing query…" : "Executando query…"}
            </motion.div>
          ) : rows.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "2rem",
                textAlign: "center",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                color: "var(--color-muted)",
                border: "1px dashed var(--color-border)",
              }}
            >
              {lang === "en" ? "No rows yet — run the pipeline." : "Sem linhas ainda — rode o pipeline."}
            </motion.div>
          ) : (
            <motion.table
              key="table"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.72rem",
              }}
            >
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c}
                      style={{
                        textAlign: "left",
                        padding: "0.4rem 0.6rem",
                        color: "var(--color-accent)",
                        borderBottom: "1px solid var(--color-border)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td
                        key={c}
                        style={{
                          padding: "0.4rem 0.6rem",
                          color: row[c] === null ? "var(--color-decorative)" : "var(--color-body)",
                          borderBottom: "1px solid var(--color-border)",
                          whiteSpace: "nowrap",
                          fontStyle: row[c] === null ? "italic" : "normal",
                        }}
                      >
                        {row[c] === null ? "NULL" : String(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ctaButton(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    background: disabled ? "transparent" : "var(--color-accent)",
    color: disabled ? "var(--color-muted)" : "var(--color-bg)",
    border: `1px solid ${disabled ? "var(--color-border)" : "var(--color-accent)"}`,
    padding: "0.5rem 1rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.2s, color 0.2s, border-color 0.2s",
    minHeight: 36,
  }
}

function ghostButton(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    background: "transparent",
    color: disabled ? "var(--color-decorative)" : "var(--color-muted)",
    border: "1px solid var(--color-border)",
    padding: "0.5rem 1rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "color 0.2s, border-color 0.2s",
    minHeight: 36,
  }
}
