"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Translations } from "@/lib/i18n"

type AsyncDuckDBConnection = import("@duckdb/duckdb-wasm").AsyncDuckDBConnection
type Row = Record<string, unknown>

type Props = {
  /** Live connection from the parent. May be null while DuckDB is still loading. */
  getConnection: () => AsyncDuckDBConnection | null
  /** Are the bronze/silver/gold tables materialized yet? Surface examples accordingly. */
  pipelineDone: boolean
  t: Translations
  lang: string
}

const EXAMPLES: { label: string; sql: string }[] = [
  {
    label: "Top medidores por kWh",
    sql: "SELECT meter_id, SUM(consumption_kwh) AS total_kwh\nFROM silver_meter_consumption\nGROUP BY 1\nORDER BY total_kwh DESC;",
  },
  {
    label: "Linhas dropadas no Bronze",
    sql: "SELECT raw_id, meter_id, raw_value\nFROM staging_meter_readings\nWHERE raw_value IS NULL OR TRY_CAST(raw_value AS DOUBLE) IS NULL;",
  },
  {
    label: "Médias por hora",
    sql: "SELECT hour_bucket, AVG(consumption_kwh) AS avg_kwh\nFROM silver_meter_consumption\nGROUP BY 1\nORDER BY 1;",
  },
  {
    label: "Inspecionar schema",
    sql: "SELECT table_name, column_name, data_type\nFROM information_schema.columns\nWHERE table_schema = 'main'\nORDER BY table_name, ordinal_position;",
  },
]

const DEFAULT_QUERY =
  "-- DuckDB SQL. Tabelas: staging_meter_readings, bronze_meter_readings,\n-- silver_meter_consumption, gold_consumption_by_site.\nSELECT * FROM staging_meter_readings LIMIT 10;"

export default function SqlEditor({ getConnection, pipelineDone, t, lang }: Props) {
  const [sql, setSql] = useState(DEFAULT_QUERY)
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [executionMs, setExecutionMs] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const run = useCallback(async () => {
    const conn = getConnection()
    if (!conn || running) return
    setRunning(true)
    setError(null)
    try {
      const t0 = performance.now()
      const result = await conn.query(sql)
      const out = result.toArray().map((r) => {
        const obj = r.toJSON() as Record<string, unknown>
        for (const k of Object.keys(obj)) {
          const v = obj[k]
          if (typeof v === "bigint") obj[k] = Number(v)
          else if (v instanceof Date) obj[k] = v.toISOString()
        }
        return obj
      })
      const t1 = performance.now()
      setRows(out)
      setExecutionMs(t1 - t0)
    } catch (err) {
      setRows(null)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setRunning(false)
    }
  }, [sql, running, getConnection])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter runs the query, like every SQL IDE.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      run()
    }
  }

  const columns = rows && rows.length > 0 ? Object.keys(rows[0]) : []

  return (
    <section
      id="sql-editor"
      style={{
        marginTop: "clamp(3rem, 6vw, 5rem)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(2rem, 4vw, 3rem)",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="label-mono" style={{ display: "block", marginBottom: "0.5rem" }}>
          {t.playground_editor_label}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 300,
            color: "var(--color-heading)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            marginBottom: "0.75rem",
          }}
        >
          {t.playground_editor_heading}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.95rem",
            color: "var(--color-body)",
            lineHeight: 1.7,
            maxWidth: 720,
          }}
        >
          {t.playground_editor_subtitle}
        </p>
      </div>

      {/* Examples */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginRight: "0.5rem",
          }}
        >
          {t.playground_editor_examples}
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => {
              setSql(ex.sql)
              setError(null)
              // Focus the textarea so the user can iterate immediately.
              requestAnimationFrame(() => textareaRef.current?.focus())
            }}
            disabled={!pipelineDone && ex.sql.includes("silver_") || (!pipelineDone && ex.sql.includes("bronze_"))}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              background: "transparent",
              color: "var(--color-body)",
              border: "1px solid var(--color-border)",
              padding: "0.4rem 0.75rem",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)"
              e.currentTarget.style.color = "var(--color-accent)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)"
              e.currentTarget.style.color = "var(--color-body)"
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Editor + actions */}
      <div
        style={{
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          aria-label={t.playground_editor_aria}
          style={{
            width: "100%",
            minHeight: 180,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "vertical",
            padding: "1rem",
            color: "var(--color-heading)",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.85rem",
            lineHeight: 1.65,
            letterSpacing: "0.01em",
            // Tab key inserts a tab character rather than moving focus
            // would require a more involved handler; left as default for now.
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.75rem",
            borderTop: "1px solid var(--color-border)",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={run}
            disabled={running || !getConnection()}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              background: running || !getConnection() ? "transparent" : "var(--color-accent)",
              color: running || !getConnection() ? "var(--color-muted)" : "var(--color-bg)",
              border: `1px solid ${running || !getConnection() ? "var(--color-border)" : "var(--color-accent)"}`,
              padding: "0.5rem 1rem",
              cursor: running || !getConnection() ? "not-allowed" : "pointer",
              transition: "background 0.2s, color 0.2s, border-color 0.2s",
              minHeight: 36,
            }}
          >
            {running
              ? lang === "en"
                ? "Running…"
                : "Executando…"
              : t.playground_editor_run}
          </button>
          <button
            type="button"
            onClick={() => {
              setSql("")
              setRows(null)
              setError(null)
              setExecutionMs(null)
              requestAnimationFrame(() => textareaRef.current?.focus())
            }}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              background: "transparent",
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              minHeight: 36,
            }}
          >
            {t.playground_editor_clear}
          </button>
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.65rem",
              color: "var(--color-muted)",
              letterSpacing: "0.05em",
              marginLeft: "auto",
            }}
          >
            ⌘/Ctrl + ↵
          </span>
        </div>
      </div>

      {/* Result */}
      <div style={{ marginTop: "1rem" }}>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                border: "1px solid #ff6b6b",
                background: "rgba(255,107,107,0.05)",
                padding: "1rem",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.78rem",
                color: "#ffb3b3",
                lineHeight: 1.55,
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#ff6b6b",
                  marginBottom: "0.5rem",
                }}
              >
                {t.playground_editor_error}
              </div>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {error}
              </pre>
            </motion.div>
          ) : rows === null ? null : rows.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                border: "1px dashed var(--color-border)",
                padding: "1.5rem",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                color: "var(--color-muted)",
                textAlign: "center",
              }}
            >
              {lang === "en" ? "0 rows returned." : "0 linhas retornadas."}
            </motion.div>
          ) : (
            <motion.div
              key={`rows-${rows.length}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "var(--color-muted)",
                }}
              >
                <span>
                  {rows.length} {lang === "en" ? "rows" : "linhas"}
                  {executionMs !== null && ` · ${executionMs.toFixed(1)}ms`}
                </span>
              </div>
              <div style={{ overflowX: "auto", maxHeight: 360, overflowY: "auto" }}>
                <table
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
                            position: "sticky",
                            top: 0,
                            background: "var(--color-surface)",
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
                              color:
                                row[c] === null ? "var(--color-decorative)" : "var(--color-body)",
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
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
