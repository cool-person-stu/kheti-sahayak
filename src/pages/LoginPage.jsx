import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SunLogo from "../components/SunLogo"
import LanguagePicker from "../components/LanguagePicker"
import VoiceInput from "../components/VoiceInput"
import { useTranslation } from "../lib/useTranslation"
import { logIn } from "../lib/auth"

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [village, setVillage] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    setError("")
    if (!name.trim() || !village.trim() || !password.trim()) {
      setError(t("fillAllFields"))
      return
    }
    const result = logIn({ name, village, password })
    if (result.error) { setError(result.error); return }
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.97_0.01_85)] to-[oklch(0.93_0.025_85)] flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-4"><LanguagePicker /></div>
      <div className="bg-base-100 rounded-box shadow-xl p-8 w-full max-w-lg text-center">
        <SunLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="font-display text-3xl font-extrabold text-neutral mb-1">Annadata</h1>
        <p className="text-base-content/60 mb-6">{t("welcomeBack")}</p>

        <div className="space-y-4 text-left">
          <label className="form-control">
            <span className="label"><span className="label-text font-semibold">{t("nameLabel")}</span></span>
            <div className="flex items-center gap-2">
              <input className="input input-bordered flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} />
              <VoiceInput onResult={(text) => setName(text)} />
            </div>
          </label>

          <label className="form-control">
            <span className="label"><span className="label-text font-semibold">{t("villageLabel")}</span></span>
            <div className="flex items-center gap-2">
              <input className="input input-bordered flex-1" value={village} onChange={(e) => setVillage(e.target.value)} placeholder={t("villagePlaceholder")} />
              <VoiceInput onResult={(text) => setVillage(text)} />
            </div>
          </label>

          <label className="form-control">
            <span className="label"><span className="label-text font-semibold">{t("passwordLabel")}</span></span>
            <input className="input input-bordered" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("passwordPlaceholder")} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </label>

          {error && <p className="text-error text-sm">{error}</p>}

          <button className="btn btn-primary btn-lg w-full" onClick={handleLogin}>
            {t("logIn")}
          </button>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-6">
          {t("noAccount")} <Link to="/signup" className="link link-primary">{t("signUp")}</Link>
        </p>
      </div>
    </div>
  )
}
