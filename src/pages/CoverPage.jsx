import { useState } from "react"
import { Link } from "react-router-dom"
import SunLogo from "../components/SunLogo"
import LanguagePicker from "../components/LanguagePicker"
import { useTranslation } from "../lib/useTranslation"

function Doodle({ className, children }) {
  return (
    <div className={`absolute opacity-[0.07] pointer-events-none ${className}`}>
      {children}
    </div>
  )
}

export default function CoverPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.97_0.01_85)] via-[oklch(0.95_0.02_85)] to-[oklch(0.93_0.025_85)] relative overflow-hidden flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <LanguagePicker />
      </div>

      <Doodle className="top-10 left-8 text-primary" >
        <svg viewBox="0 0 120 120" className="w-28 h-28"><circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6"/><path d="M60 20 C60 20 80 40 80 60 C80 80 60 100 60 100 C60 100 40 80 40 60 C40 40 60 20 60 20Z" fill="currentColor" opacity="0.3"/></svg>
      </Doodle>
      <Doodle className="top-32 right-12 text-secondary">
        <svg viewBox="0 0 100 100" className="w-20 h-20"><path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.2"/></svg>
      </Doodle>
      <Doodle className="bottom-40 left-16 text-accent">
        <svg viewBox="0 0 80 80" className="w-16 h-16"><rect x="10" y="10" width="60" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(15 40 40)"/></svg>
      </Doodle>
      <Doodle className="bottom-20 right-20 text-primary">
        <svg viewBox="0 0 100 100" className="w-24 h-24"><path d="M50 5 C50 5 75 25 75 50 C75 75 50 95 50 95 C50 95 25 75 25 50 C25 25 50 5 50 5Z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="50" y1="50" x2="50" y2="95" stroke="currentColor" strokeWidth="1.5"/></svg>
      </Doodle>
      <Doodle className="top-1/2 left-4 text-success">
        <svg viewBox="0 0 60 60" className="w-14 h-14"><circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/></svg>
      </Doodle>
      <Doodle className="top-1/3 right-1/4 text-warning">
        <svg viewBox="0 0 80 80" className="w-16 h-16"><path d="M10 40 Q40 10 70 40 Q40 70 10 40Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
      </Doodle>

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <SunLogo className="w-24 h-24 sm:w-32 sm:h-32 mb-6 drop-shadow-lg" />

        <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-primary mb-3 tracking-tight">
          Annadata
        </h1>
        <p className="font-display text-lg sm:text-xl text-base-content/60 mb-2">
          {t("tagline")}
        </p>

        <div className="max-w-md mx-auto mt-8 space-y-3">
          <div className="flex items-start gap-3 text-sm text-base-content/70">
            <span className="text-primary text-lg mt-0.5">&#x1F33E;</span>
            <p>{t("coverFeature1")}</p>
          </div>
          <div className="flex items-start gap-3 text-sm text-base-content/70">
            <span className="text-primary text-lg mt-0.5">&#x1F4CA;</span>
            <p>{t("coverFeature2")}</p>
          </div>
          <div className="flex items-start gap-3 text-sm text-base-content/70">
            <span className="text-primary text-lg mt-0.5">&#x1F916;</span>
            <p>{t("coverFeature3")}</p>
          </div>
          <div className="flex items-start gap-3 text-sm text-base-content/70">
            <span className="text-primary text-lg mt-0.5">&#x1F4B0;</span>
            <p>{t("coverFeature4")}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full max-w-sm">
          <Link to="/login" className="btn btn-primary btn-lg flex-1 gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            {t("logIn")}
          </Link>
          <Link to="/signup" className="btn btn-outline btn-lg flex-1 gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            {t("signUp")}
          </Link>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-base-content/40 relative z-10">
        {t("appName")} &middot; {t("tagline")}
      </footer>
    </div>
  )
}
