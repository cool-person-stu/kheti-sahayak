import { STATUS_OPTIONS } from "../lib/store"

const BADGE_STYLES = {
  claimed: "bg-success/15 text-success border-success/40",
  available: "bg-secondary/15 text-warning-content border-secondary/50",
  "not-applicable": "bg-error/10 text-error border-error/30",
  "not-checked": "bg-neutral/10 text-neutral border-neutral/30",
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`badge badge-lg border font-semibold uppercase tracking-wide ${BADGE_STYLES[status] || BADGE_STYLES["not-checked"]}`}
    >
      {status === "claimed" ? "✓ " : ""}
      {STATUS_OPTIONS[status] || STATUS_OPTIONS["not-checked"]}
    </span>
  )
}
