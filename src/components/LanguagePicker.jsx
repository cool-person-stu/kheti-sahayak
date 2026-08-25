import { useState, useRef, useEffect } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { LANGUAGES } from "../lib/languages"

export default function LanguagePicker({ className = "" }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [])

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen(!open)
  }

  const voiceLabel = (l) => {
    if (!l.speechInput && !l.speechOutput) return "text only"
    if (!l.speechInput) return "read only"
    return ""
  }

  return (
    <>
      <button
        ref={btnRef}
        className={`btn btn-sm btn-outline gap-2 normal-case ${className}`}
        onClick={toggle}
        type="button"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7 1.62-4.33L19.12 17h-3.24z" />
        </svg>
        <span className="text-sm">{current.native}</span>
        <svg viewBox="0 0 24 24" className={`w-3 h-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor">
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6-1.41 1.41Z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed bg-base-100 border border-base-content/20 rounded-box shadow-2xl w-64 max-h-80 overflow-y-auto"
          style={{ top: pos.top, right: pos.right, zIndex: 9999 }}
        >
          {LANGUAGES.map((l) => {
            const label = voiceLabel(l)
            return (
              <button
                key={l.code}
                type="button"
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors flex items-center justify-between ${l.code === lang ? "bg-primary/10 font-bold text-primary" : ""}`}
                onClick={() => { setLang(l.code); setOpen(false) }}
              >
                <span>
                  <span className="font-medium">{l.native}</span>
                  <span className="text-base-content/50 ml-1.5">{l.name}</span>
                </span>
                {label && <span className="text-xs text-base-content/40">{label}</span>}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
