// Synthetic dataset: meter readings from a fake SAP ERP drop.
// Realistic medallion pipeline — Staging → Bronze → Silver → Gold —
// designed to be small enough that the result of every step fits on
// one screen, but heterogeneous enough to show real cleaning logic
// (null filtering, type casting, dedup, window functions, aggregation).

export type StepKey = "staging" | "bronze" | "silver" | "gold"

export type Step = {
  key: StepKey
  label: string
  layerColor: string
  description: string
  description_en: string
  /** SQL that materializes the table for this step. */
  sql: string
  /** SELECT that previews the resulting table (LIMITed). */
  previewSql: string
}

export const SEED_STAGING_SQL = /* sql */ `
CREATE OR REPLACE TABLE staging_meter_readings (
  raw_id        VARCHAR,
  meter_id      VARCHAR,
  reading_at    VARCHAR,   -- raw ISO string, may be malformed
  raw_value     VARCHAR,   -- string with optional unit, may be NULL or 'INVALID'
  site_code     VARCHAR,
  source_system VARCHAR
);

INSERT INTO staging_meter_readings VALUES
  ('1',  'M-001', '2026-05-19T08:00:00', '142.5',    'CD-SP-01', 'SAP-ERP-PROD'),
  ('2',  'M-001', '2026-05-19T09:00:00', '145.2',    'CD-SP-01', 'SAP-ERP-PROD'),
  ('3',  'M-001', '2026-05-19T10:00:00',  NULL,      'CD-SP-01', 'SAP-ERP-PROD'),
  ('4',  'M-002', '2026-05-19T08:00:00', '98.1',     'CD-RJ-01', 'SAP-ERP-PROD'),
  ('5',  'M-002', '2026-05-19T08:00:00', '98.1',     'CD-RJ-01', 'SAP-ERP-PROD'),
  ('6',  'M-002', '2026-05-19T09:00:00', '99.4',     'CD-RJ-01', 'SAP-ERP-PROD'),
  ('7',  'M-003', '2026-05-19T08:00:00', '231.8',    'CD-SP-02', 'SAP-ERP-PROD'),
  ('8',  'M-003', '2026-05-19T09:00:00', '233.1',    'CD-SP-02', 'SAP-ERP-PROD'),
  ('9',  'M-003', '2026-05-19T10:00:00', 'INVALID',  'CD-SP-02', 'SAP-ERP-PROD'),
  ('10', 'M-001', '2026-05-19T11:00:00', '147.9',    'CD-SP-01', 'SAP-ERP-PROD');
`

export const BRONZE_SQL = /* sql */ `
-- Typed + deduped. Drop NULLs and non-numeric readings.
-- Dedup on (meter_id, reading_at) keeping the lowest raw_id.
CREATE OR REPLACE TABLE bronze_meter_readings AS
SELECT
  raw_id,
  meter_id,
  CAST(reading_at AS TIMESTAMP)             AS reading_at,
  TRY_CAST(raw_value AS DOUBLE)             AS reading_kwh,
  site_code,
  source_system,
  CURRENT_TIMESTAMP                         AS ingested_at
FROM (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY meter_id, reading_at
      ORDER BY raw_id
    ) AS rn
  FROM staging_meter_readings
  WHERE raw_value IS NOT NULL
    AND TRY_CAST(raw_value AS DOUBLE) IS NOT NULL
) WHERE rn = 1;
`

export const SILVER_SQL = /* sql */ `
-- Consumption deltas + temporal enrichment using window functions.
CREATE OR REPLACE TABLE silver_meter_consumption AS
WITH ordered AS (
  SELECT
    meter_id,
    site_code,
    reading_at,
    reading_kwh,
    LAG(reading_kwh) OVER (PARTITION BY meter_id ORDER BY reading_at) AS prev_kwh,
    LAG(reading_at)  OVER (PARTITION BY meter_id ORDER BY reading_at) AS prev_at
  FROM bronze_meter_readings
)
SELECT
  meter_id,
  site_code,
  reading_at,
  reading_kwh,
  reading_kwh - prev_kwh                            AS consumption_kwh,
  DATE_DIFF('minute', prev_at, reading_at)          AS minutes_since_prev,
  DATE_TRUNC('hour', reading_at)                    AS hour_bucket
FROM ordered
WHERE prev_kwh IS NOT NULL;
`

export const GOLD_SQL = /* sql */ `
-- Daily aggregate per distribution center — ready for BI.
CREATE OR REPLACE TABLE gold_consumption_by_site AS
SELECT
  site_code,
  DATE_TRUNC('day', reading_at)             AS day,
  COUNT(DISTINCT meter_id)                  AS active_meters,
  ROUND(SUM(consumption_kwh), 2)            AS total_kwh,
  ROUND(AVG(consumption_kwh), 2)            AS avg_kwh_per_reading
FROM silver_meter_consumption
GROUP BY 1, 2
ORDER BY 1, 2;
`

export const STEPS: Step[] = [
  {
    key: "staging",
    label: "Staging",
    layerColor: "#8A8A8A",
    description:
      "Drop bruto do SAP ERP — strings sem tipos, valores nulos, duplicatas e linhas inválidas convivendo.",
    description_en:
      "Raw drop from SAP ERP — typeless strings, nulls, duplicates and invalid rows all mixed together.",
    sql: SEED_STAGING_SQL.trim(),
    previewSql: "SELECT * FROM staging_meter_readings ORDER BY raw_id",
  },
  {
    key: "bronze",
    label: "Bronze",
    layerColor: "#CD7F32",
    description:
      "Tipagem + dedup. TRY_CAST descarta valores não-numéricos, ROW_NUMBER() resolve a duplicata em (meter_id, reading_at).",
    description_en:
      "Typing + dedup. TRY_CAST drops non-numeric values; ROW_NUMBER() collapses duplicates on (meter_id, reading_at).",
    sql: BRONZE_SQL.trim(),
    previewSql: "SELECT * FROM bronze_meter_readings ORDER BY meter_id, reading_at",
  },
  {
    key: "silver",
    label: "Silver",
    layerColor: "#C0C0C0",
    description:
      "Delta de consumo entre leituras consecutivas usando LAG() particionado por medidor. Adiciona hour_bucket pra análise temporal.",
    description_en:
      "Consumption delta between consecutive readings via LAG() partitioned by meter. Adds hour_bucket for temporal analysis.",
    sql: SILVER_SQL.trim(),
    previewSql: "SELECT * FROM silver_meter_consumption ORDER BY meter_id, reading_at",
  },
  {
    key: "gold",
    label: "Gold",
    layerColor: "#E8C547",
    description:
      "Tabela analítica por centro de distribuição — pronta pra consumo em BI (Looker/Power BI). Granularidade dia × site.",
    description_en:
      "Analytical table by distribution center — ready for BI consumption (Looker/Power BI). Day × site grain.",
    sql: GOLD_SQL.trim(),
    previewSql: "SELECT * FROM gold_consumption_by_site ORDER BY site_code, day",
  },
]
