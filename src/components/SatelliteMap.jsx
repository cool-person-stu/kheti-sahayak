import { useEffect, useRef, useState } from "react"
import { useTranslation } from "../lib/useTranslation"

export default function SatelliteMap({ lat, lng, farmerName }) {
  const { t } = useTranslation()
  const mapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!lat || !lng || loaded) return

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }
        const s = document.createElement("script")
        s.src = src
        s.onload = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })

    const loadCSS = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return
      const l = document.createElement("link")
      l.rel = "stylesheet"
      l.href = href
      document.head.appendChild(l)
    }

    const init = async () => {
      try {
        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
        loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")

        const L = window.L
        if (!L || !mapRef.current || loaded) return

        const map = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: 16,
          zoomControl: false,
        })

        L.control.zoom({ position: "bottomright" }).addTo(map)

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?Time=2024-01-01",
          {
            maxZoom: 19,
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
          }
        ).addTo(map)

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_BoundariesAndPlaces/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            opacity: 0.4,
          }
        ).addTo(map)

        const marker = L.marker([lat, lng]).addTo(map)
        if (farmerName) {
          marker.bindPopup(`<b>${farmerName}</b><br>${t("farmLocation")}`).openPopup()
        }

        L.circle([lat, lng], {
          radius: 500,
          color: "oklch(0.55 0.15 155)",
          fillColor: "oklch(0.55 0.15 155)",
          fillOpacity: 0.08,
          weight: 2,
          dashArray: "6 4",
        }).addTo(map)

        setLoaded(true)
      } catch {
        // silent fail
      }
    }

    init()
  }, [lat, lng, farmerName, loaded, t])

  if (!lat || !lng) {
    return (
      <div className="rounded-box bg-base-200 p-6 text-center text-sm text-base-content/60">
        {t("noLocationRecorded")}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-box border border-base-content/10">
      <div ref={mapRef} className="h-64 sm:h-80 w-full" />
    </div>
  )
}
