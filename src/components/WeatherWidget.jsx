import { useState, useEffect } from "react"
import { fetchWeather, getApiKey, setApiKey } from "../lib/weather"
import { useTranslation } from "../lib/useTranslation"

export default function WeatherWidget({ lat, lng }) {
  const { t } = useTranslation()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKeyState] = useState(getApiKey())
  const [showSetup, setShowSetup] = useState(!apiKey)

  useEffect(() => {
    if (!lat || !lng || !apiKey) return
    setLoading(true)
    fetchWeather(lat, lng).then((data) => {
      setWeather(data)
      setLoading(false)
    })
  }, [lat, lng, apiKey])

  const saveKey = (key) => {
    setApiKey(key)
    setApiKeyState(key)
    setShowSetup(false)
  }

  if (showSetup) {
    return (
      <div className="rounded-box bg-base-200 p-4 text-sm">
        <p className="font-semibold text-base-content/80 mb-2">
          {t("connectWeather")}
        </p>
        <p className="text-base-content/60 mb-3">
          {t("enterApiKey")}{" "}
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noreferrer"
            className="link link-primary"
          >
            openweathermap.org
          </a>{" "}
          ({t("takesMinute")}), {t("pasteApiKey").toLowerCase()}:
        </p>
        <div className="flex gap-2">
          <input
            className="input input-bordered input-sm flex-1"
            placeholder={t("pasteApiKey")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) saveKey(e.target.value.trim())
            }}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              const input = e.target.closest(".flex").querySelector("input")
              if (input.value.trim()) saveKey(input.value.trim())
            }}
          >
            {t("save")}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-box bg-base-200 p-4 text-sm text-base-content/60 animate-pulse">
        {t("fetchingWeather")}
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="rounded-box bg-base-200 p-4 text-sm text-base-content/60">
        {t("weatherError")}
      </div>
    )
  }

  return (
    <div className="rounded-box bg-gradient-to-br from-info/10 to-primary/10 border border-info/30 p-4">
      <div className="flex items-center gap-4">
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-14 h-14"
        />
        <div>
          <p className="font-display text-2xl font-bold text-neutral">
            {weather.temp}&deg;C
          </p>
          <p className="text-sm text-base-content/70 capitalize">
            {weather.description}
          </p>
        </div>
        <div className="ml-auto text-right text-sm text-base-content/70">
          <p>{t("humidity")}: {weather.humidity}%</p>
          <p>{t("wind")}: {weather.windSpeed} km/h</p>
          {weather.rainfall > 0 && <p>{t("rain")}: {weather.rainfall} mm</p>}
        </div>
      </div>
    </div>
  )
}
