import { useState } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { useTranslation } from "../lib/useTranslation"
import { isSpeechOutputSupported } from "../lib/languages"

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[|]/g, " ")
    .replace(/[-]{3,}/g, " ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim()
}

function findBestVoice(lang) {
  const voices = window.speechSynthesis?.getVoices() || []
  if (voices.length === 0) return null

  const langBase = lang.split("-")[0].toLowerCase()

  const exact = voices.find((v) => v.lang === lang)
  if (exact) return exact

  const startsWith = voices.find((v) => v.lang.startsWith(langBase))
  if (startsWith) return startsWith

  const langLower = lang.toLowerCase()
  const partial = voices.find((v) => v.lang.toLowerCase().startsWith(langBase))
  if (partial) return partial

  return null
}

export default function SpeakerButton({ text, label, className = "" }) {
  const { lang } = useLanguage()
  const { t } = useTranslation()
  const [speaking, setSpeaking] = useState(false)
  const btnLabel = label || t("readAloud")
  const supported = isSpeechOutputSupported(lang)

  const speak = () => {
    if (!("speechSynthesis" in window) || !supported) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const cleanText = stripMarkdown(text)
    if (!cleanText) return
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = lang
    utterance.rate = 0.9

    const voice = findBestVoice(lang)
    if (voice) utterance.voice = voice

    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  if (!supported) {
    return (
      <button
        type="button"
        className={`btn btn-sm btn-ghost gap-2 btn-disabled ${className}`}
        title={t("voiceNotSupported")}
        disabled
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-30" fill="currentColor" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12Zm-2.5 7.53v2.04A6.5 6.5 0 0 0 19 12 6.5 6.5 0 0 0 14 4.43v2.04A4.5 4.5 0 0 1 17 12a4.5 4.5 0 0 1-3 4.53Z" />
        </svg>
        <span className="text-xs opacity-50">{btnLabel}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`btn btn-sm btn-ghost gap-2 ${speaking ? "text-secondary" : ""} ${className}`}
      onClick={speak}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12Zm-2.5 7.53v2.04A6.5 6.5 0 0 0 19 12 6.5 6.5 0 0 0 14 4.43v2.04A4.5 4.5 0 0 1 17 12a4.5 4.5 0 0 1-3 4.53Z" />
      </svg>
      {btnLabel}
    </button>
  )
}
