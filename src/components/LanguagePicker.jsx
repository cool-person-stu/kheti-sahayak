import { useState } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { LANGUAGES } from "../lib/languages"

export default function LanguagePicker() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid oklch(0.8 0 0)",
          background: "oklch(0.98 0 0)",
          cursor: "pointer",
          fontSize: "14px",
          fontFamily: "inherit",
        }}
      >
        🌐 {current.native}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
          }}
        />
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            top: "50px",
            right: "16px",
            width: "260px",
            maxHeight: "320px",
            overflowY: "auto",
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            zIndex: 9999,
            padding: "4px",
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => { setLang(l.code); setOpen(false) }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                background: l.code === lang ? "oklch(0.92 0.04 155)" : "transparent",
                fontWeight: l.code === lang ? "bold" : "normal",
                color: l.code === lang ? "oklch(0.45 0.15 155)" : "#333",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              {l.native} — {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
