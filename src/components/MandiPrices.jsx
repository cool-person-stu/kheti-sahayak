import { useState, useEffect } from "react"
import { findNearbyMandi } from "../lib/mandi"
import { fetchNearbyMandiPrices } from "../lib/agmarknet"
import { useTranslation } from "../lib/useTranslation"

export default function MandiPrices({ crop, farmerLocation }) {
  const { t } = useTranslation()
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sortOrder, setSortOrder] = useState("distance")
  const [lastUpdated, setLastUpdated] = useState("")

  useEffect(() => {
    if (!farmerLocation?.lat || !farmerLocation?.lng || !crop) {
      setPrices([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError("")

    const load = async () => {
      const nearby = findNearbyMandi(farmerLocation.lat, farmerLocation.lng, crop, 300)

      const result = await fetchNearbyMandiPrices({ nearbyMandis: nearby, crop })
      if (cancelled) return

      if (result.prices && result.prices.length > 0) {
        const sorted = [...result.prices].sort((a, b) => (a.distance || 0) - (b.distance || 0))
        setPrices(sorted)
        const latest = sorted.map((p) => p.date).filter(Boolean).sort().pop()
        if (latest) setLastUpdated(latest)
      } else {
        setPrices([])
        setError(result.error || t("noMandiFound"))
      }
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [crop, farmerLocation?.lat, farmerLocation?.lng, t])

  const sorted = [...prices].sort((a, b) => {
    if (sortOrder === "price") return (b.price || 0) - (a.price || 0)
    if (sortOrder === "deal") return (b.maxPrice || 0) - (a.maxPrice || 0)
    return (a.distance || 0) - (b.distance || 0)
  })

  if (!farmerLocation?.lat) {
    return (
      <div className="text-center py-6 text-base-content/50">
        <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto mb-2 opacity-40" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <p className="text-sm">{t("enableLocationPrices")}</p>
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="text-center py-6 text-base-content/50">
        <p className="text-sm">{t("selectCropPrices")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          <button
            className={`btn btn-xs ${sortOrder === "distance" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSortOrder("distance")}
          >
            {t("nearest")}
          </button>
          <button
            className={`btn btn-xs ${sortOrder === "price" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSortOrder("price")}
          >
            {t("highestPrice")}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {lastUpdated && (
            <span className="text-base-content/50">
              <svg viewBox="0 0 24 24" className="w-3 h-3 inline-block mr-1 text-success" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1 5h2v6h-2V7Zm0 8h2v2h-2v-2Z"/></svg>
              {lastUpdated}
            </span>
          )}
          <span className="badge badge-success badge-sm gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success-content animate-pulse" />
            {t("live")}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-dots loading-sm"></span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-6 text-base-content/50">
          <p className="text-sm">{error || t("noMandiFound")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr className="text-xs text-base-content/60">
                <th>{t("market")}</th>
                <th>{t("distance")}</th>
                <th>{t("state")}</th>
                <th className="text-right">{t("pricePerQuintal")}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={i} className="hover">
                  <td className="font-medium">{p.market}</td>
                  <td className="text-base-content/60">{p.distance ?? ""} km</td>
                  <td className="text-base-content/70">{p.state}</td>
                  <td className="text-right">
                    <div className="font-display font-bold text-primary">
                      ₹{p.price ? p.price.toLocaleString("en-IN") : "—"}
                    </div>
                    {p.minPrice > 0 && p.maxPrice > 0 && (
                      <div className="text-[10px] text-base-content/50">
                        {p.minPrice.toLocaleString("en-IN")} – {p.maxPrice.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-base-content/50">
        {t("livePrices")} — Agmarknet / data.gov.in
      </p>
    </div>
  )
}