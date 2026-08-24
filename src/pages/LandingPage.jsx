import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import SunLogo from "../components/SunLogo"
import LanguagePicker from "../components/LanguagePicker"
import { useTranslation } from "../lib/useTranslation"
import { getCurrentUser } from "../lib/auth"

const FARMING_QUOTES = [
  { text: "जय जवान, जय किसान", lang: "हिन्दी" },
  { text: "কৃষি হলো দেশের মেরুদণ্ড", lang: "বাংলা" },
  { text: "వ్యవసాయం దేశ ఆత్మ", lang: "తెలుగు" },
  { text: "शेती ही देशाचा पाया आहे", lang: "मराठी" },
  { text: "விவசாயம் நாட்டின் உயிர்நாடி", lang: "தமிழ்" },
  { text: "کسان ملک کی ریڑھ کی ہڈی ہے", lang: "اردو" },
  { text: "ખેતી દેશની કરોડરજ્જૂ છે", lang: "ગુજરાતી" },
  { text: "ಕೃಷಿ ದೇಶದ ಬೆನ್ನೆಲುಬು", lang: "ಕನ್ನಡ" },
  { text: "കൃഷി രാജ്യത്തിൻറെ മേരുദണ്ഡം", lang: "മലയാളം" },
  { text: "ਖੇਤੀ ਦੇਸ਼ ਦੀ ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਹੈ", lang: "ਪੰਜਾਬੀ" },
  { text: "ଚାଷ ହେଉଛି ଦେଶର ମେରୁଦଣ୍ଡ", lang: "ଓଡ଼ିଆ" },
  { text: "কৃষি দেশৰ মেরুদণ্ড", lang: "অসমীয়া" },
  { text: "खेती देशक कमर हो", lang: "नेपाली" },
  { text: "कृषि देश केर मेरुदंड अछि", lang: "मैथिली" },
  { text: "ᱪᱟᱹᱞᱤ ᱫᱷᱟᱨᱤᱭᱟᱜ ᱥᱚ ᱠᱚ ᱫᱟᱨᱚᱜᱚ", lang: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { text: "کسان مُلک کِس کolumn ہیہ", lang: "कॉशुर" },
  { text: "ڪسان ملڪ جي ڪنٻڙ آهن", lang: "सिन्धी" },
  { text: "कृषि देश दी रीड दी हड्डी ऐ", lang: "डोगरी" },
  { text: "शेती ह्या देशाचो कण्ठ आहे", lang: "कोंकणी" },
  { text: "ꯃꯤꯠꯛꯁꯨꯡ ꯃꯅꯌ ꯁꯥꯢꯕ ꯃꯊꯛꯁꯤ", lang: "মৈতৈলোন্" },
  { text: "गोबर थिनाय गोबर सुविधा लागिब मन नांगौ", lang: "बड़ो" },
  { text: "The farmer is the backbone of the nation", lang: "English" },
]

function Doodle({ className, children }) {
  return (
    <div className={`absolute opacity-[0.06] pointer-events-none ${className}`}>{children}</div>
  )
}

export default function LandingPage() {
  const { t } = useTranslation()
  const user = getCurrentUser()
  const [quoteIdx, setQuoteIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setQuoteIdx((i) => (i + 1) % FARMING_QUOTES.length), 3500)
    return () => clearInterval(timer)
  }, [])

  const quote = FARMING_QUOTES[quoteIdx]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.97_0.01_85)] via-[oklch(0.95_0.02_82)] to-[oklch(0.93_0.025_85)] relative overflow-hidden">
      <Doodle className="top-8 left-6 text-primary">
        <svg viewBox="0 0 140 140" className="w-32 h-32">
          <path d="M70 10 C70 10 100 40 100 70 C100 100 70 130 70 130 C70 130 40 100 40 70 C40 40 70 10 70 10Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <line x1="70" y1="70" x2="70" y2="130" stroke="currentColor" strokeWidth="2"/>
          <path d="M55 55 Q70 35 85 55" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M50 75 Q70 55 90 75" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </Doodle>

      <Doodle className="top-20 right-10 text-secondary">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4"/>
          <path d="M50 15 L50 85" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M15 50 L85 50" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.15"/>
        </svg>
      </Doodle>

      <Doodle className="bottom-32 left-12 text-accent">
        <svg viewBox="0 0 120 120" className="w-28 h-28">
          <path d="M20 100 L60 20 L100 100 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M35 80 L60 35 L85 80" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="60" y1="20" x2="60" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3"/>
        </svg>
      </Doodle>

      <Doodle className="bottom-16 right-16 text-primary">
        <svg viewBox="0 0 100 100" className="w-22 h-22">
          <rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(12 50 50)"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </Doodle>

      <Doodle className="top-1/3 left-1/4 text-success">
        <svg viewBox="0 0 80 80" className="w-18 h-18">
          <path d="M10 70 Q25 20 40 40 Q55 60 70 10" fill="none" stroke="currentColor" strokeWidth="2.5"/>
          <circle cx="10" cy="70" r="4" fill="currentColor" opacity="0.2"/>
          <circle cx="70" cy="10" r="4" fill="currentColor" opacity="0.2"/>
        </svg>
      </Doodle>

      <Doodle className="top-1/2 right-1/3 text-warning">
        <svg viewBox="0 0 90 90" className="w-20 h-20">
          <path d="M45 5 L55 35 L85 35 L60 55 L70 85 L45 65 L20 85 L30 55 L5 35 L35 35 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </Doodle>

      <Doodle className="top-3/4 left-8 text-info">
        <svg viewBox="0 0 70 70" className="w-16 h-16">
          <path d="M35 5 C35 5 55 20 55 35 C55 50 35 65 35 65 C35 65 15 50 15 35 C15 20 35 5 35 5Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <line x1="35" y1="35" x2="35" y2="65" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M25 30 Q35 20 45 30" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </Doodle>

      <Doodle className="bottom-1/3 right-8 text-primary">
        <svg viewBox="0 0 60 60" className="w-14 h-14">
          <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 5"/>
        </svg>
      </Doodle>

      <div className="absolute top-4 right-4 z-10">
        <LanguagePicker />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">
        <SunLogo className="w-28 h-28 sm:w-36 sm:h-36 mb-6 drop-shadow-lg animate-bounce" style={{ animationDuration: "3s" }} />

        <h1 className="font-display text-6xl sm:text-8xl font-extrabold text-primary mb-2 tracking-tight drop-shadow-sm">
          Annadata
        </h1>

        <p className="font-display text-lg sm:text-xl text-base-content/50 mb-6 italic">
          {t("tagline")}
        </p>

        <div className="h-12 flex items-center justify-center mb-10">
          <p key={quoteIdx} className="text-base sm:text-lg text-base-content/70 font-medium transition-all duration-500 text-center">
            "{quote.text}"
            <span className="block text-xs text-base-content/40 mt-1 not-italic">— {quote.lang}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
          {[
            { icon: "\u{1F33E}", label: t("checkBenefits") },
            { icon: "\u{1F4CA}", label: t("smartTools") },
            { icon: "\u{1F916}", label: t("aiAssistant") },
            { icon: "\u{1F4B0}", label: t("sellDirect") },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2 p-4 rounded-box bg-base-100/80 border border-base-content/10 shadow-sm">
              <span className="text-3xl">{f.icon}</span>
              <span className="text-xs font-semibold text-base-content/70 text-center">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg flex-1 gap-2 text-lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              {t("goToDashboard")}
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-lg flex-1 gap-2 text-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                {t("logIn")}
              </Link>
              <Link to="/signup" className="btn btn-outline btn-lg flex-1 gap-2 text-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                {t("signUp")}
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 max-w-lg text-center">
          <p className="text-xs text-base-content/40 leading-relaxed">
            {t("landingFooter")}
          </p>
        </div>
      </div>
    </div>
  )
}
