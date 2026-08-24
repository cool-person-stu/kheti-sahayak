import { useEffect, useRef, useState } from "react"

export default function SatelliteMap({ lat, lng, farmerName }) {
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
          zoom: 15,
          zoomControl: false,
        })

        L.control.zoom({ position: "bottomright" }).addTo(map)

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 18,
            attribution: "Tiles &copy; Esri",
          }
        ).addTo(map)

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(farmerName || "Farm location")
          .openPopup()

        setLoaded(true)
      } catch {
        // silent fail — map just won't show
      }
    }

    init()
  }, [lat, lng, farmerName, loaded])

  if (!lat || !lng) {
    return (
      <div className="rounded-box bg-base-200 p-6 text-center text-sm text-base-content/60">
        No location recorded. Add GPS when adding the farmer to see the satellite map.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-box border border-base-content/10">
      <div ref={mapRef} className="h-64 sm:h-80 w-full" />
    </div>
  )
}
