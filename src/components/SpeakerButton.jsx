import { useState, useEffect } from "react"
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
    .replace(/₹[\d,]+/g, (match) => {
      return match.replace(/₹/, "rupees ")
    })
    .replace(/[\d,]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function findBestVoice(lang) {
  let voices = window.speechSynthesis?.getVoices() || []

  if (voices.length === 0) {
    return new Promise((resolve) => {
      const handler = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler)
        resolve(tryMatch(window.speechSynthesis.getVoices(), lang))
      }
      window.speechSynthesis.addEventListener("voiceschanged", handler)
      setTimeout(() => resolve(null), 500)
    })
  }

  return tryMatch(voices, lang)
}

function tryMatch(voices, lang) {
  const langBase = lang.split("-")[0].toLowerCase()
  const langLower = lang.toLowerCase()

  const exact = voices.find((v) => v.lang === lang)
  if (exact) return exact

  const exactCase = voices.find((v) => v.lang.toLowerCase() === langLower)
  if (exactCase) return exactCase

  const startsWithFull = voices.find((v) => v.lang.toLowerCase().startsWith(langLower))
  if (startsWithFull) return startsWithFull

  const baseMatch = voices.find((v) => v.lang.toLowerCase().startsWith(langBase))
  if (baseMatch) return baseMatch

  const HindiLike = ["hi", "sa", "ne", "mai", "doi", "ks", "brx"]
  if (HindiLike.includes(langBase)) {
    const hindi = voices.find((v) => v.lang.toLowerCase().startsWith("hi"))
    if (hindi) return hindi
  }

  return null
}

export default function SpeakerButton({ text, label, className = "" }) {
  const { lang } = useLanguage()
  const { t } = useTranslation()
  const [speaking, setSpeaking] = useState(false)
  const [voicesReady, setVoicesReady] = useState(false)
  const btnLabel = label || t("readAloud")
  const supported = isSpeechOutputSupported(lang)

  useEffect(() => {
    if (!("speechSynthesis" in window)) return
    const handler = () => setVoicesReady(true)
    window.speechSynthesis.addEventListener("voiceschanged", handler)
    if (window.speechSynthesis.getVoices().length > 0) setVoicesReady(true)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", handler)
  }, [])

  const speak = async () => {
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
    utterance.rate = 0.85
    utterance.pitch = 1

    const voice = await findBestVoice(lang)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    }

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
      className={`btn btn-sm btn-ghost gap-2 ${speaking ? "text-secondary animate-pulse" : ""} ${className}`}
      onClick={speak}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        {speaking ? (
          <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12Zm-2.5 7.53v2.04A6.5 6.5 0 0 0 19 12 6.5 6.5 0 0 0 14 4.43v2.04A4.5 4.5 0 0 1 17 12a4.5 4.5 0 0 1-3 4.53Z" />
        ) : (
          <>
            <path d="M3 9v6h4l5 5V4L7 9H3Z" />
            <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            <path d="M19 12c0-3.53-2.04-6.58-5-8.05v2.18c1.88 1.26 3 3.45 3 5.87s-1.12 4.61-3 5.87v2.18c2.96-1.48 5-4.53 5-8.05z" />
          </>
        )}
      </svg>
      {btnLabel}
    </button>
  )
}
