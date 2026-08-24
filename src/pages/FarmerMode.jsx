import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import SunLogo from "../components/SunLogo"
import LanguagePicker from "../components/LanguagePicker"
import { addFarmer } from "../lib/store"
import { useLanguage } from "../lib/LanguageContext"
import { useTranslation } from "../lib/useTranslation"

function VoiceButton({ onResult, className = "" }) {
  const { lang } = useLanguage()
  const [listening, setListening] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const recRef = useRef(null)
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  const { t } = useTranslation()

  const toggle = () => {
    if (!SR) { setUnsupported(true); return }
    if (listening) { recRef.current?.stop(); return }
    const r = new SR()
    r.lang = lang
    r.interimResults = false
    r.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false) }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    recRef.current = r
    setListening(true)
    r.start()
  }

  return (
    <button type="button" className={`btn btn-lg ${listening ? "btn-error animate-pulse" : "btn-primary"} ${className}`} onClick={toggle}>
      {unsupported ? t("voiceNotSupported") : listening ? t("listening") : t("speak")}
    </button>
  )
}

export default function FarmerMode() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [village, setVillage] = useState("")
  const [crop, setCrop] = useState("")
  const [done, setDone] = useState(false)
  const [farmerId, setFarmerId] = useState(null)
  const { t } = useTranslation()

  const steps = [
    { question: t("whatYourName"), placeholder: t("speakOrType") },
    { question: t("whichVillage"), placeholder: t("speakOrType") },
    { question: t("whatGrow"), placeholder: t("speakOrType") },
  ]

  const handleResult = (text) => {
    if (step === 0) setName(text)
    else if (step === 1) setVillage(text)
    else setCrop(text)
  }

  const next = () => {
    if (step < steps.length - 1) { setStep(step + 1); return }
    if (name.trim()) {
      const f = addFarmer({ name: name.trim(), village: village.trim(), crop: crop.trim() })
      setFarmerId(f.id)
      setDone(true)
    }
  }

  const val = step === 0 ? name : step === 1 ? village : crop

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="btn btn-ghost text-primary-content mb-8 gap-2">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" /></svg>
        {t("backToApp")}
      </Link>
      <div className="bg-base-100 rounded-box shadow-xl p-8 w-full max-w-lg text-center">
        <SunLogo className="w-16 h-16 mx-auto mb-4" />
        <div className="mb-6 flex justify-center"><LanguagePicker /></div>
        {done ? (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" /></svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral">{t("detailsSavedMsg")}</h2>
            <p className="text-base-content/70">{t("nameFromVillageCrop", { name, village, crop })}</p>
            <div className="flex flex-col gap-3 mt-6">
              <Link to={`/farmers/${farmerId}`} className="btn btn-primary btn-lg">{t("seeMyBenefits")}</Link>
              <button className="btn btn-ghost" onClick={() => { setStep(0); setName(""); setVillage(""); setCrop(""); setDone(false); setFarmerId(null) }}>{t("addAnother")}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-base-content/50 mb-2">{t("step")} {step + 1} {t("ofSteps")} {steps.length}</p>
              <h2 className="font-display text-2xl font-bold text-neutral">{steps[step].question}</h2>
            </div>
            <input className="input input-bordered input-lg w-full text-center text-lg" value={val} onChange={(e) => handleResult(e.target.value)} onKeyDown={(e) => e.key === "Enter" && next()} placeholder={steps[step].placeholder} autoFocus />
            <VoiceButton onResult={handleResult} className="w-full" />
            <button className="btn btn-secondary btn-lg w-full" onClick={next} disabled={!val.trim()}>{step === steps.length - 1 ? t("save") : t("next")}</button>
          </div>
        )}
      </div>
    </div>
  )
}
