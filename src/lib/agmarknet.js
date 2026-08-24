const AGMARKNET_KEY = "YOUR_DATAGOVIN_API_KEY"
const BASE_URL = "https://api.data.gov.in/resource/3ef3a874-8224-4dd1-b86f-7d4d5a6c4e6e"

export function getAgmarknetKey() {
  return AGMARKNET_KEY
}

export function isAgmarknetConfigured() {
  return AGMARKNET_KEY && AGMARKNET_KEY !== "YOUR_DATAGOVIN_API_KEY"
}

function buildFilterString({ state, market, crop }) {
  const filters = []
  if (state) filters.push(`"state": "${state}"`)
  if (market) filters.push(`"market": "${market}"`)
  if (crop) filters.push(`"commodity": "${crop}"`)
  if (filters.length === 0) return ""
  return `{${filters.join(", ")}}`
}

async function fetchFromAgmarknet({ state, market, crop, limit = 20 }) {
  if (!isAgmarknetConfigured()) return { error: "Agmarknet API key not configured" }

  const filters = buildFilterString({ state, market, crop })
  const params = new URLSearchParams({
    "api-key": AGMARKNET_KEY,
    format: "json",
    limit: String(limit),
  })
  if (filters) params.set("filters[replace](0)[field]", "")

  let url = `${BASE_URL}?${params.toString()}`
  if (filters) {
    const filterParts = []
    if (state) filterParts.push(`state=${state}`)
    if (market) filterParts.push(`market=${market}`)
    if (crop) filterParts.push(`commodity=${crop}`)
    filterParts.forEach((f) => url += `&filters[${f.split("=")[0]}]=${encodeURIComponent(f.split("=")[1])}`)
  }

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.error) return { error: data.error }
    const records = data.records || data.data || []
    return {
      prices: records.map((r) => ({
        crop: r.commodity || r.crop || "",
        market: r.market || "",
        state: r.state || "",
        price: parseFloat(r.modal_price || r.min_price || r.max_price || 0),
        minPrice: parseFloat(r.min_price || 0),
        maxPrice: parseFloat(r.max_price || 0),
        unit: "quintal",
        date: r.arrival_date || r.price_date || "",
        grade: r.grade || "",
      })),
    }
  } catch (err) {
    return { error: "Failed to fetch data from Agmarknet" }
  }
}

export async function fetchMandiPrices({ state, market, crop, limit = 20 }) {
  return fetchFromAgmarknet({ state, market, crop, limit })
}

export async function fetchNearbyMandiPrices({ nearbyMandis, crop }) {
  if (!isAgmarknetConfigured()) {
    return {
      prices: nearbyMandis
        .filter((m) => m.hasCrop)
        .map((m) => ({
          crop: crop,
          market: m.name,
          state: m.state,
          price: 0,
          unit: "quintal",
          date: "",
          distance: Math.round(m.distance),
        })),
      source: "unavailable",
    }
  }

  const allPrices = []
  const mandisToFetch = nearbyMandis.filter((m) => m.hasCrop).slice(0, 3)

  for (const mandi of mandisToFetch) {
    const result = await fetchMandiPrices({
      state: mandi.state,
      market: mandi.name,
      crop: crop,
      limit: 5,
    })
    if (result.prices) {
      result.prices.forEach((p) => allPrices.push({ ...p, distance: Math.round(mandi.distance) }))
    }
  }

  return { prices: allPrices, source: "agmarknet" }
}

export function getFallbackPrices(nearbyMandis, crop) {
  const MOCK_PRICES = {
    wheat: [2100, 2300, 2150, 2250],
    rice: [2000, 2200, 2100, 2150],
    maize: [1800, 2000, 1900, 1950],
    cotton: [6200, 6600, 6400, 6500],
    soybean: [4300, 4600, 4500, 4400],
    sugarcane: [280, 320, 300, 310],
    potato: [1000, 1300, 1100, 1200],
    tomato: [1200, 1800, 1400, 1600],
    onion: [900, 1200, 1000, 1100],
    gram: [5000, 5500, 5200, 5400],
    pulses: [6000, 6800, 6400, 6600],
    groundnut: [5500, 6000, 5700, 5800],
    mustard: [4800, 5200, 5000, 5100],
    barley: [1600, 1800, 1700, 1750],
  }

  const normalized = crop?.toLowerCase().trim() || ""
  const basePrices = MOCK_PRICES[normalized] || [2000, 2200, 2100, 2150]

  return nearbyMandis.slice(0, 4).map((m, i) => ({
    crop: crop,
    market: m.name,
    state: m.state,
    price: basePrices[i % basePrices.length],
    unit: "quintal",
    date: new Date().toISOString().slice(0, 10),
    distance: Math.round(m.distance),
    source: "mock",
  }))
}
