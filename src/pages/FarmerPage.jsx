import { useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { FACILITIES, FACILITY_KEYS } from "../lib/facilities"
import { getFarmer, getStatus, setStatus } from "../lib/store"
import { useTranslation } from "../lib/useTranslation"
import StatusBadge from "../components/StatusBadge"
import SpeakerButton from "../components/SpeakerButton"
import EnvDataForm from "../components/EnvDataForm"
import PhotoUpload from "../components/PhotoUpload"
import CropCalculator from "../components/CropCalculator"
import WeatherWidget from "../components/WeatherWidget"
import SatelliteMap from "../components/SatelliteMap"
import AutoMatch from "../components/AutoMatch"
import MandiPrices from "../components/MandiPrices"
import PriceComparison from "../components/PriceComparison"
import DirectSale from "../components/DirectSale"

const STATUS_KEYS = ["claimed", "available", "not-applicable", "not-checked"]

function FacilityCard({ facility, status, onSetStatus }) {
  const { t } = useTranslation()
  const keys = FACILITY_KEYS[facility.id]
  const name = keys ? t(keys.name) : facility.name
  const benefit = keys ? t(keys.benefit) : facility.benefit
  const whatItGives = keys ? t(keys.what) : facility.whatItGives
  const nextSteps = keys ? t(keys.next) : facility.nextSteps
  const readText = `${name}. ${benefit}. ${whatItGives} ${t("whatToDoNext")}: ${nextSteps}`

  return (
    <div className="card bg-base-100 border border-base-content/10 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-extrabold text-lg shrink-0">
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-neutral leading-tight">
                {name}
              </h3>
              <p className="text-sm text-base-content/60">{benefit}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <p className="mt-4 text-base-content/80">{whatItGives}</p>

        <div className="mt-3 rounded-box bg-secondary/10 border border-secondary/30 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-warning-content mb-1">
            {t("whatToDoNext")}
          </p>
          <p className="text-sm text-base-content/80">{nextSteps}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SpeakerButton text={readText} label={t("readAloud")} />
        </div>
      </div>

      <div className="divider my-0 mx-5" />

      <div className="p-4 sm:px-6">
        <p className="text-xs font-semibold text-base-content/60 mb-2">
          {t("markAs")}
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_KEYS.map((key) => (
            <button
              key={key}
              className={`btn btn-sm ${status === key ? "btn-primary" : "btn-outline"}`}
              onClick={() => onSetStatus(facility.id, key)}
            >
              {key === "claimed" ? "✓ " : ""}
              {t(key.replace("-", ""))}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function CollapsibleSection({ title, icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card bg-base-100 border border-base-content/10 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-display text-lg font-bold text-neutral">{title}</span>
          {badge}
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`w-5 h-5 text-base-content/50 transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6-1.41 1.41Z" />
        </svg>
      </button>
      {open && <div className="px-4 sm:px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function FarmerPage() {
  const { id } = useParams()
  const [farmer, setFarmer] = useState(() => getFarmer(id))
  const { t } = useTranslation()

  if (!farmer) {
    return <Navigate to="/" replace />
  }

  const refresh = () => setFarmer(getFarmer(id))

  const handleSetStatus = (facilityId, status) => {
    setStatus(id, facilityId, status)
    refresh()
  }

  const claimedCount = FACILITIES.filter((f) => getStatus(id, f.id) === "claimed").length
  const loc = farmer.location

  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      <div className="sticky top-0 z-10 bg-base-100/90 backdrop-blur py-3">
        <Link to="/" className="btn btn-sm btn-ghost gap-1">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" />
          </svg>
          {t("allFarmers")}
        </Link>
      </div>

      <header className="mt-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16 h-16 font-display text-3xl font-bold">
              {farmer.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral">
              {farmer.name}
            </h1>
            <p className="text-base-content/70">
              {farmer.village}
              {farmer.crop ? ` · ${farmer.crop}` : ""}
            </p>
            {loc && (
              <p className="text-xs text-primary mt-1 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
                {t("gpsRecorded")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-box bg-primary/10 border border-primary/30 p-4 flex items-center gap-3">
          <span className="text-2xl font-display font-extrabold text-primary">
            {claimedCount}
          </span>
          <p className="text-sm text-base-content/80">
            {t("facilityCount", { count: FACILITIES.length })}
            {claimedCount < FACILITIES.length
              ? " " + t("letFindMore")
              : " " + t("greatWork")}
          </p>
        </div>
      </header>

      <div className="space-y-5">
        <CollapsibleSection
          title={t("smartMatch")}
          icon={
            <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
              </svg>
            </div>
          }
        >
          <AutoMatch farmerId={id} farmerCrop={farmer.crop} />
        </CollapsibleSection>

        {loc && (
          <CollapsibleSection
            title={t("weather")}
            icon={
              <div className="w-9 h-9 rounded-full bg-info/15 text-info flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96Z" />
                </svg>
              </div>
            }
          >
            <WeatherWidget lat={loc.lat} lng={loc.lng} />
          </CollapsibleSection>
        )}

        {loc && (
          <CollapsibleSection
            title={t("satellite")}
            icon={
              <div className="w-9 h-9 rounded-full bg-success/15 text-success flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z" />
                </svg>
              </div>
            }
          >
            <SatelliteMap lat={loc.lat} lng={loc.lng} farmerName={farmer.name} />
          </CollapsibleSection>
        )}

        <CollapsibleSection
          title={t("marketPrices")}
          icon={
            <div className="w-9 h-9 rounded-full bg-secondary/15 text-warning-content flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z" />
              </svg>
            </div>
          }
        >
          <MandiPrices crop={farmer.crop} />
        </CollapsibleSection>

        <CollapsibleSection
          title={t("priceComparison")}
          icon={
            <div className="w-9 h-9 rounded-full bg-warning/15 text-warning-content flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6Z" />
              </svg>
            </div>
          }
        >
          <PriceComparison farmerId={id} farmerCrop={farmer.crop} />
        </CollapsibleSection>

        <CollapsibleSection
          title={t("directSale")}
          icon={
            <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" />
                <path d="M15 12h-5M12 9l3 3-3 3" />
              </svg>
            </div>
          }
        >
          <DirectSale
            farmerId={id}
            farmerName={farmer.name}
            farmerCrop={farmer.crop}
            farmerVillage={farmer.village}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={t("envSoil")}
          icon={
            <div className="w-9 h-9 rounded-full bg-success/15 text-success flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M12 22a9 9 0 0 0 8.4-6H3.6A9 9 0 0 0 12 22Zm0-18C7.58 4 4 7.58 4 12c0 .34.02.68.07 1h15.86c.05-.32.07-.66.07-1 0-4.42-3.58-8-8-8Z" />
              </svg>
            </div>
          }
        >
          <EnvDataForm farmerId={id} />
        </CollapsibleSection>

        <CollapsibleSection
          title={t("harvestPhotos")}
          icon={
            <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M9 3 7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9Zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3Z" />
              </svg>
            </div>
          }
        >
          <PhotoUpload farmerId={id} />
        </CollapsibleSection>

        <CollapsibleSection
          title={t("cropCalculator")}
          icon={
            <div className="w-9 h-9 rounded-full bg-warning/15 text-warning-content flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
              </svg>
            </div>
          }
        >
          <CropCalculator farmerId={id} defaultCrop={farmer.crop?.split(",")[0]} />
        </CollapsibleSection>

        <h2 className="font-display text-2xl font-bold text-neutral mt-8">
          {t("facilities")}
        </h2>
        {FACILITIES.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            status={getStatus(id, facility.id)}
            onSetStatus={handleSetStatus}
          />
        ))}
      </div>
    </div>
  )
}
