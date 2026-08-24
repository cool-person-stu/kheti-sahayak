import { useState, useRef, useEffect } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { useTranslation } from "../lib/useTranslation"
import { askAI, getAIKey } from "../lib/ai"
import { getSensorData, getMockSensorData, formatSensorForAI } from "../lib/soilSensor"
import { getEnvData } from "../lib/store"
import { getCropPricing } from "../lib/store"
import { fetchWeather, getApiKey as getWeatherKey } from "../lib/weather"
import { getLanguage } from "../lib/languages"
import VoiceInput from "./VoiceInput"
import SpeakerButton from "./SpeakerButton"

export default function AiChat({ farmer }) {
  const { lang } = useLanguage()
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: question }])
    setLoading(true)

    const sensorData = formatSensorForAI(getSensorData() || getMockSensorData(), getEnvData(farmer.id))
    const pricing = getCropPricing(farmer.id)
    const pricingStr = pricing ? `${pricing.cropType} at ₹${pricing.estimatedValue || 0} for ${pricing.quantity} ${pricing.unit}` : ""

    let weatherData = null
    const wk = getWeatherKey()
    if (wk && farmer.location) {
      try { weatherData = await fetchWeather(farmer.location.lat, farmer.location.lng) } catch {}
    }

    const result = await askAI({
      question,
      farmerData: farmer,
      sensorData,
      weatherData,
      cropPricing: pricingStr,
      language: getLanguage(lang).name,
      chatHistory: messages,
    })

    const reply = result.error || result.text
    setMessages((prev) => [...prev, { role: "assistant", text: reply }])
    setLoading(false)
  }

  if (!getAIKey() || getAIKey() === "YOUR_GEMINI_API_KEY") {
    return (
      <div className="card bg-base-100 border border-base-content/10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <h3 className="font-display text-xl font-bold text-neutral mb-2">{t("aiSetupTitle")}</h3>
        <p className="text-sm text-base-content/60 mb-4">{t("aiSetupDesc")}</p>
        <p className="text-xs text-base-content/50">{t("aiSetupHint")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <p className="font-display text-lg font-bold text-neutral">{t("aiGreeting")}</p>
            <p className="text-sm text-base-content/60 mt-1">{t("aiGreetingDesc")}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {[t("aiSuggestion1"), t("aiSuggestion2"), t("aiSuggestion3")].map((s) => (
                <button key={s} className="btn btn-sm btn-outline" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-box px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.role === "assistant" && (
                <div className="mt-2">
                  <SpeakerButton text={msg.text} label={t("readAloud")} className="text-xs" />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-base-200 rounded-box px-4 py-3">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-base-content/10 p-3">
        <div className="flex items-center gap-2">
          <VoiceInput onResult={(text) => setInput(text)} />
          <input
            className="input input-bordered flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("aiPlaceholder")}
            disabled={loading}
          />
          <button className="btn btn-primary btn-circle" onClick={handleSend} disabled={loading || !input.trim()}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
