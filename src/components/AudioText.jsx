import { useState } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { useTranslation } from "../lib/useTranslation"

export default function AudioText({ text, as: Tag = "span", className = "" }) {
  const { lang } = useLanguage()
  const { t } = useTranslation()
  const [speaking, setSpeaking] = useState(false)

  const speak = (e) => {
    e.stopPropagation()
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.95
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <Tag className={`inline-flex items-center gap-1.5 ${className}`}>
      {text}
      <button
        type="button"
        onClick={speak}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors shrink-0 ${
          speaking
            ? "bg-primary/20 text-primary animate-pulse"
            : "bg-base-content/5 text-base-content/40 hover:bg-primary/10 hover:text-primary"
        }`}
        title={t("listen")}
        aria-label={`${t("listen")}: ${text}`}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12Zm-2.5 7.53v2.04A6.5 6.5 0 0 0 19 12 6.5 6.5 0 0 0 14 4.43v2.04A4.5 4.5 0 0 1 17 12a4.5 4.5 0 0 1-3 4.53Z" />
        </svg>
      </button>
    </Tag>
  )
}
