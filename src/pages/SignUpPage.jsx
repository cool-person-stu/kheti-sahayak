import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SunLogo from "../components/SunLogo"
import LanguagePicker from "../components/LanguagePicker"
import VoiceInput from "../components/VoiceInput"
import { useTranslation } from "../lib/useTranslation"
import { signUp } from "../lib/auth"

export default function SignUpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [village, setVillage] = useState("")
  const [crop, setCrop] = useState("")
  const [landSize, setLandSize] = useState("")
  const [landUnit, setLandUnit] = useState("acre")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const steps = [
    { q: t("whatYourName"), ph: t("namePlaceholder"), val: name, set: setName },
    { q: t("whichVillage"), ph: t("villagePlaceholder"), val: village, set: setVillage },
    { q: t("whatGrow"), ph: t("cropPlaceholder"), val: crop, set: setCrop },
    { q: t("landSize"), ph: t("landSizePlaceholder"), val: landSize, set: setLandSize },
    { q: t("phoneLabel"), ph: t("phonePlaceholder"), val: phone, set: setPhone },
    { q: t("createPassword"), ph: t("passwordPlaceholder"), val: password, set: setPassword },
  ]

  const next = () => {
    setError("")
    if (step < steps.length - 1) { setStep(step + 1); return }
    const result = signUp({ name, village, crop, landSize, landUnit, phone, password })
    if (result.error) { setError(result.error); return }
    navigate("/")
  }

  const back = () => { if (step > 0) setStep(step - 1) }
  const val = steps[step].val

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.97_0.01_85)] to-[oklch(0.93_0.025_85)] flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-4"><LanguagePicker /></div>
      <div className="bg-base-100 rounded-box shadow-xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <SunLogo className="w-14 h-14 mx-auto mb-3" />
          <p className="text-sm text-base-content/50 mb-2">{t("step")} {step + 1} {t("ofSteps")} {steps.length}</p>
          <h2 className="font-display text-2xl font-bold text-neutral">{steps[step].q}</h2>
        </div>

        <div className="space-y-4">
          {step === 3 && (
            <div className="flex gap-2">
              {["acre", "hectare", "bigha", "ground"].map((u) => (
                <button key={u} className={`btn btn-xs ${landUnit === u ? "btn-primary" : "btn-outline"}`} onClick={() => setLandUnit(u)}>
                  {u}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              className="input input-bordered input-lg flex-1 text-lg"
              type={step === 5 ? "password" : step === 4 ? "tel" : "text"}
              value={val}
              onChange={(e) => steps[step].set(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && val.trim() && next()}
              placeholder={steps[step].ph}
              autoFocus
            />
            <VoiceInput onResult={(text) => steps[step].set(text)} />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <div className="flex gap-2">
            {step > 0 && <button className="btn btn-ghost flex-1" onClick={back}>{t("back")}</button>}
            <button className="btn btn-primary btn-lg flex-1" onClick={next} disabled={!val.trim()}>
              {step === steps.length - 1 ? t("signUp") : t("next")}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-6">
          {t("alreadyHaveAccount")} <Link to="/login" className="link link-primary">{t("logIn")}</Link>
        </p>
      </div>
    </div>
  )
}
