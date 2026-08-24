import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SunLogo from "../components/SunLogo"
import LanguagePicker from "../components/LanguagePicker"
import AudioText from "../components/AudioText"
import WeatherWidget from "../components/WeatherWidget"
import SatelliteMap from "../components/SatelliteMap"
import MandiPrices from "../components/MandiPrices"
import PriceComparison from "../components/PriceComparison"
import DirectSale from "../components/DirectSale"
import EnvDataForm from "../components/EnvDataForm"
import CropCalculator from "../components/CropCalculator"
import PhotoUpload from "../components/PhotoUpload"
import AiChat from "../components/AiChat"
import { useTranslation } from "../lib/useTranslation"
import { getCurrentUser, logOut, updateCurrentUser } from "../lib/auth"
import { FACILITIES, FACILITY_KEYS } from "../lib/facilities"
import { getStatus, setStatus } from "../lib/store"
import SpeakerButton from "../components/SpeakerButton"

function CollapsibleSection({ title, icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card bg-base-100 border border-base-content/10 shadow-sm overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-display font-bold text-neutral">{title}</span>
          {badge}
        </div>
        <svg viewBox="0 0 24 24" className={`w-5 h-5 text-base-content/50 transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor">
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6-1.41 1.41Z" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

const STATUS_KEYS = ["claimed", "available", "not-applicable", "not-checked"]

function FacilityExpand({ facility, status, onSetStatus, t }) {
  const [open, setOpen] = useState(false)
  const keys = FACILITY_KEYS[facility.id]
  const name = keys ? t(keys.name) : facility.name
  const benefit = keys ? t(keys.benefit) : facility.benefit
  const whatItGives = keys ? t(keys.what) : facility.whatItGives
  const nextSteps = keys ? t(keys.next) : facility.nextSteps
  const colors = { claimed: "border-success/40 bg-success/5", available: "border-secondary/40 bg-secondary/5", "not-checked": "border-base-content/20", "not-applicable": "border-error/30 bg-error/5" }
  const readText = `${name}. ${benefit}. ${whatItGives} ${t("whatToDoNext")}: ${nextSteps}`
  return (
    <div className={`card border shadow-sm ${colors[status] || ""}`}>
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(!open)}>
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold shrink-0">{name.charAt(0)}</div>
        <div className="flex-1 min-w-0">
          <AudioText text={name} as="p" className="font-semibold text-sm" />
          <p className="text-xs text-base-content/60">{benefit}</p>
        </div>
        <span className={`badge badge-sm ${status === "claimed" ? "badge-success" : status === "available" ? "badge-warning" : "badge-ghost"}`}>
          {status === "claimed" ? "✓ " : ""}{t(status.replace("-", ""))}
        </span>
        <svg viewBox="0 0 24 24" className={`w-4 h-4 text-base-content/40 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} fill="currentColor">
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6-1.41 1.41Z" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-base-content/80">{whatItGives}</p>
          <div className="rounded-box bg-secondary/10 border border-secondary/30 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-warning-content mb-1">{t("whatToDoNext")}</p>
            <p className="text-sm text-base-content/80">{nextSteps}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SpeakerButton text={readText} label={t("readAloud")} />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_KEYS.map((key) => (
              <button key={key} className={`btn btn-xs ${status === key ? "btn-primary" : "btn-outline"}`} onClick={() => onSetStatus(facility.id, key)}>
                {key === "claimed" ? "✓ " : ""}{t(key.replace("-", ""))}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SmartTab({ farmer, onRefresh }) {
  const { t } = useTranslation()
  const loc = farmer.location
  const handleSetStatus = (facilityId, status) => { setStatus(farmer.id, facilityId, status); onRefresh() }
  return (
    <div className="space-y-4">
      <AudioText text={t("smartMatch")} as="h2" className="font-display text-2xl font-bold text-neutral" />
      <p className="text-base-content/70">{t("smartMatchFor")}: {farmer.crop || t("yourCrop")}</p>
      <div className="space-y-3">
        {FACILITIES.map((f) => (
          <FacilityExpand key={f.id} facility={f} status={getStatus(farmer.id, f.id)} onSetStatus={handleSetStatus} t={t} />
        ))}
      </div>
      {loc && (
        <CollapsibleSection title={t("weather")} icon={<div className="w-8 h-8 rounded-full bg-info/15 text-info flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96Z" /></svg></div>}>
          <WeatherWidget lat={loc.lat} lng={loc.lng} />
        </CollapsibleSection>
      )}
      {loc && (
        <CollapsibleSection title={t("satellite")} icon={<div className="w-8 h-8 rounded-full bg-success/15 text-success flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z" /></svg></div>}>
          <SatelliteMap lat={loc.lat} lng={loc.lng} farmerName={farmer.name} />
        </CollapsibleSection>
      )}
      <CollapsibleSection title={t("marketPrices")} icon={<div className="w-8 h-8 rounded-full bg-secondary/15 text-warning-content flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z" /></svg></div>}>
        <MandiPrices crop={farmer.crop} farmerLocation={farmer.location} />
      </CollapsibleSection>
      <CollapsibleSection title={t("priceComparison")} icon={<div className="w-8 h-8 rounded-full bg-warning/15 text-warning-content flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6Z" /></svg></div>}>
        <PriceComparison farmerId={farmer.id} farmerCrop={farmer.crop} />
      </CollapsibleSection>
      <CollapsibleSection title={t("directSale")} icon={<div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" /><path d="M15 12h-5M12 9l3 3-3 3" /></svg></div>}>
        <DirectSale farmerId={farmer.id} farmerName={farmer.name} farmerCrop={farmer.crop} farmerVillage={farmer.village} />
      </CollapsibleSection>
      <CollapsibleSection title={t("envSoil")} icon={<div className="w-8 h-8 rounded-full bg-success/15 text-success flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 22a9 9 0 0 0 8.4-6H3.6A9 9 0 0 0 12 22Zm0-18C7.58 4 4 7.58 4 12c0 .34.02.68.07 1h15.86c.05-.32.07-.66.07-1 0-4.42-3.58-8-8-8Z" /></svg></div>}>
        <EnvDataForm farmerId={farmer.id} />
      </CollapsibleSection>
      <CollapsibleSection title={t("harvestPhotos")} icon={<div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M9 3 7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9Zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3Z" /></svg></div>}>
        <PhotoUpload farmerId={farmer.id} />
      </CollapsibleSection>
      <CollapsibleSection title={t("cropCalculator")} icon={<div className="w-8 h-8 rounded-full bg-warning/15 text-warning-content flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" /></svg></div>}>
        <CropCalculator farmerId={farmer.id} defaultCrop={farmer.crop?.split(",")[0]} />
      </CollapsibleSection>
    </div>
  )
}

function FarmerHome() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [farmer, setFarmer] = useState(getCurrentUser)
  const [tab, setTab] = useState("home")
  const claimedCount = FACILITIES.filter((f) => getStatus(farmer.id, f.id) === "claimed").length
  const unclaimedFacilities = FACILITIES.filter((f) => { const s = getStatus(farmer.id, f.id); return s === "not-checked" || s === "available" })

  const handleRefresh = () => setFarmer(getCurrentUser())

  const handleLogout = () => { logOut(); navigate("/") }

  const fetchLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => { updateCurrentUser({ location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }); handleRefresh() },
      () => {},
      { timeout: 10000 }
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <header className="pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SunLogo className="w-10 h-10" />
            <div>
              <AudioText text={t("appName")} as="h1" className="font-display text-xl sm:text-2xl font-extrabold text-neutral" />
              <p className="text-xs text-base-content/60">{t("tagline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguagePicker />
            <button className="btn btn-ghost btn-sm text-error" onClick={handleLogout} title={t("logOut")}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-14 h-14 font-display text-2xl font-bold">{farmer.name.charAt(0).toUpperCase()}</div>
          </div>
          <div className="flex-1">
            <AudioText text={farmer.name} as="p" className="font-display text-xl font-bold text-neutral" />
            <p className="text-sm text-base-content/70">{farmer.village}{farmer.crop ? ` · ${farmer.crop}` : ""}</p>
            {farmer.landSize > 0 && <p className="text-xs text-primary">{farmer.landSize} {farmer.landUnit}</p>}
            {farmer.location && <p className="text-xs text-primary">{t("gpsRecorded")}</p>}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-2xl font-extrabold text-primary">{claimedCount}/{FACILITIES.length}</span>
          <AudioText text={t("facilitiesClaimed")} as="span" className="text-sm text-base-content/70" />
        </div>
        <div className="w-full bg-base-200 rounded-full h-2 mt-2">
          <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(claimedCount / FACILITIES.length) * 100}%` }} />
        </div>
        {!farmer.location && (
          <button className="btn btn-outline btn-sm mt-3 gap-2" onClick={fetchLocation}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
            {t("useGps")}
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: "home", label: t("overview") },
          { id: "ai", label: t("aiAssistant") },
          { id: "smart", label: t("smartTools") },
          { id: "prices", label: t("marketPrices") },
          { id: "sell", label: t("directSale") },
        ].map((tb) => (
          <button key={tb.id} className={`btn btn-sm whitespace-nowrap ${tab === tb.id ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab(tb.id)}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "home" && (
        <div className="space-y-4">
          <Link to={`/farmers/${farmer.id}`} className="card bg-gradient-to-br from-primary to-accent text-primary-content shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body p-6">
              <AudioText text={t("myBenefits")} as="h3" className="font-display text-xl font-bold" />
              <p className="text-sm opacity-90">{t("checkBenefitsDesc")}</p>
              {unclaimedFacilities.length > 0 && (
                <span className="badge badge-sm bg-white/20 border-0 mt-1">{unclaimedFacilities.length} {t("notChecked")}</span>
              )}
            </div>
          </Link>
          <div className="card bg-gradient-to-br from-info to-primary text-primary-content shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setTab("ai")}>
            <div className="card-body p-6">
              <AudioText text={t("aiAssistant")} as="h3" className="font-display text-xl font-bold" />
              <p className="text-sm opacity-90">{t("aiTabDesc")}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card bg-base-100 border border-base-content/10 shadow-sm"><div className="card-body p-5"><AudioText text={t("cropCalculator")} as="h3" className="font-display font-bold text-neutral" /><p className="text-sm text-base-content/70">{t("sellDirectDesc")}</p></div></div>
            <div className="card bg-base-100 border border-base-content/10 shadow-sm"><div className="card-body p-5"><AudioText text={t("harvestPhotos")} as="h3" className="font-display font-bold text-neutral" /><p className="text-sm text-base-content/70">{t("uploadPhotosDesc")}</p></div></div>
          </div>
          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body p-5">
              <AudioText text={t("whatAppDoes")} as="h3" className="font-display text-lg font-bold text-neutral mb-3" />
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-base-content/70">
                <div><AudioText text={t("checkBenefits")} as="p" className="font-semibold text-neutral mb-1" /><p>{t("checkBenefitsDesc")}</p></div>
                <div><AudioText text={t("smartTools")} as="p" className="font-semibold text-neutral mb-1" /><p>{t("smartToolsDesc")}</p></div>
                <div><AudioText text={t("sellDirect")} as="p" className="font-semibold text-neutral mb-1" /><p>{t("sellDirectDesc")}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-4">
          <AudioText text={t("aiAssistant")} as="h2" className="font-display text-2xl font-bold text-neutral" />
          <AiChat farmer={farmer} />
        </div>
      )}

      {tab === "smart" && <SmartTab farmer={farmer} onRefresh={handleRefresh} />}

      {tab === "prices" && (
        <div className="space-y-4">
          <AudioText text={t("marketPrices")} as="h2" className="font-display text-2xl font-bold text-neutral" />
          <p className="text-sm text-base-content/60">{t("indicative")}</p>
          <MandiPrices crop={farmer.crop} farmerLocation={farmer.location} />
          <PriceComparison farmerId={farmer.id} farmerCrop={farmer.crop} />
        </div>
      )}

      {tab === "sell" && (
        <div className="space-y-4">
          <AudioText text={t("directSale")} as="h2" className="font-display text-2xl font-bold text-neutral" />
          <p className="text-base-content/70">{t("directSaleDesc")}</p>
          <DirectSale farmerId={farmer.id} farmerName={farmer.name} farmerCrop={farmer.crop} farmerVillage={farmer.village} />
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const user = getCurrentUser()
  if (!user) return null
  return <FarmerHome />
}
