// Server component — pure, no client-side logic. Renders the same on every
// page so it can be cached / streamed without hydration cost.

type Props = {
  /** When provided, shown on the left in place of the full name. */
  leftLabel?: React.ReactNode
}

export default function Footer({ leftLabel }: Props) {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "2rem clamp(1.5rem, 8vw, 8rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.75rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          color: "var(--color-muted)",
        }}
      >
        {leftLabel ?? "Marcelo Augusto Aguiar da Cruz"}
      </span>
      <span
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.05em",
          color: "var(--color-muted)",
        }}
      >
        © {new Date().getFullYear()}
      </span>
    </footer>
  )
}
