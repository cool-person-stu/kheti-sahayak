import { useLanguage } from "../lib/LanguageContext"
import { LANGUAGES } from "../lib/languages"

export default function LanguagePicker({ className = "" }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className={`relative ${className}`}>
      <select
        className="select select-bordered select-sm bg-base-100 min-w-[140px] pr-8 text-sm cursor-pointer"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {LANGUAGES.map((l) => {
          const voiceLabel = !l.speechInput && !l.speechOutput
            ? " (text only)"
            : !l.speechInput
            ? " (read only)"
            : ""
          return (
            <option key={l.code} value={l.code}>
              {l.native} — {l.name}{voiceLabel}
            </option>
          )
        })}
      </select>
    </div>
  )
}
