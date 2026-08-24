import { createContext, useContext, useState, useEffect } from "react"

const LANG_KEY = "kh_language"
const Ctx = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "hi-IN")

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
  }, [lang])

  return (
    <Ctx.Provider value={{ lang, setLang }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() {
  return useContext(Ctx)
}
