import { useState, useRef } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { useTranslation } from "../lib/useTranslation"

export default function VoiceInput({ onResult, className = "" }) {
  const { lang } = useLanguage()
  const { t } = useTranslation()
  const [listening, setListening] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const recognitionRef = useRef(null)

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  const start = () => {
    if (!SpeechRecognition) {
      setUnsupported(true)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      onResult(text)
      setListening(false)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  return (
    <button
      type="button"
      className={`btn btn-circle btn-sm ${listening ? "btn-error animate-pulse" : "btn-secondary"} ${className}`}
      onClick={start}
      title={t("speakToFill")}
      aria-label={t("speakToFill")}
    >
      {unsupported ? (
        <span className="text-xs font-bold">?</span>
      ) : (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" />
        </svg>
      )}
    </button>
  )
}
