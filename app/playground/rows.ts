// Turning an Arrow result table into plain display-ready rows.
//
// DuckDB-WASM hands back Apache Arrow, whose `toJSON()` is lossy in two ways
// that matter for a results grid:
//
//   • Int64 columns come through as `bigint`, which `String()` renders fine
//     but React refuses to serialize.
//   • TIMESTAMP and DATE columns come through as a plain `number` of epoch
//     milliseconds — never a `Date`. Rendered as-is, a `DATE_TRUNC('day', …)`
//     shows up as `1779148800000` instead of `2026-05-19`.
//
// Only the Arrow schema can tell an epoch-millisecond number apart from an
// honest count, so the formatting decision is driven by the field type.

export type Row = Record<string, unknown>

/** The slice of `arrow.Table` we depend on — kept structural so this module
 *  doesn't need `apache-arrow` as a direct dependency (it is a transitive one
 *  of `@duckdb/duckdb-wasm`, and importing it directly would pin us to their
 *  version resolution). */
type ArrowResult = {
  schema: { fields: readonly { name: string; type: unknown }[] }
  toArray(): { toJSON(): unknown }[]
}

/** Arrow's `DataType.toString()` is stable and self-describing:
 *  `Timestamp<MICROSECOND>`, `Timestamp<MICROSECOND, UTC>`, `Date32<DAY>`,
 *  `Time64<MICROSECOND>`. Matching on it avoids depending on the numeric
 *  `typeId` enum, which differs between abstract and concrete Arrow types. */
const DATE_ONLY = /^Date(32|64)?\b/
const DATE_TIME = /^Timestamp\b/
const TIME_ONLY = /^Time(32|64)?\b/

const pad = (n: number) => String(n).padStart(2, "0")

/** Formats epoch milliseconds in UTC.
 *
 *  UTC, not local time, is deliberate: DuckDB's naked `TIMESTAMP` is a
 *  wall-clock value that Arrow encodes as though it were UTC, so reading it
 *  back with local getters would shift every value by the viewer's offset —
 *  a midnight `DATE` in São Paulo would display as the previous day. */
function formatEpochMs(ms: number, withTime: boolean, timeOnly = false): string {
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) return String(ms)
  const time = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  if (timeOnly) return time
  const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
  return withTime ? `${date} ${time}` : date
}

/**
 * Converts an Arrow result table into plain objects safe to render:
 * `bigint` → `number`, temporal columns → readable strings, everything
 * else untouched.
 */
export function toDisplayRows(result: ArrowResult): Row[] {
  // Resolved once per query rather than once per cell.
  const formatters = new Map<string, (v: unknown) => unknown>()
  for (const field of result.schema.fields) {
    const type = String(field.type)
    let withTime: boolean
    let timeOnly = false
    if (DATE_TIME.test(type)) withTime = true
    else if (DATE_ONLY.test(type)) withTime = false
    else if (TIME_ONLY.test(type)) {
      withTime = true
      timeOnly = true
    } else continue

    formatters.set(field.name, (v) => {
      if (v === null || v === undefined) return v
      const ms = typeof v === "bigint" ? Number(v) : v
      if (typeof ms !== "number") return v
      return formatEpochMs(ms, withTime, timeOnly)
    })
  }

  return result.toArray().map((r) => {
    const obj = r.toJSON() as Row
    for (const key of Object.keys(obj)) {
      const format = formatters.get(key)
      if (format) {
        obj[key] = format(obj[key])
      } else if (typeof obj[key] === "bigint") {
        // Counts, sums, row ids — plain numbers render and serialize fine.
        obj[key] = Number(obj[key])
      }
    }
    return obj
  })
}
