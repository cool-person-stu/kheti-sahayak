import { useLanguage } from "./LanguageContext"
import translations from "./translations"

export function useTranslation() {
  const { lang } = useLanguage()
  const t = (key, params) => {
    let str = translations[lang]?.[key] || translations["en-IN"]?.[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v)
      })
    }
    return str
  }
  return { t, lang }
}
