const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`
const DEMO_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"

const CACHE_KEY = "kh_live_prices_cache"
const CACHE_TTL = 30 * 60 * 1000

export function getAgmarknetKey() {
  return import.meta.env.VITE_DATAGOVIN_KEY || DEMO_KEY
}

export function isAgmarknetConfigured() {
  return true
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}")
  } catch { return {} }
}

function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

async function fetchFromAgmarknet({ state = "", market = "", commodity = "", limit = 20 }) {
  const params = new URLSearchParams({
    "api-key": getAgmarknetKey(),
    format: "json",
    limit: String(limit),
  })

  if (commodity) params.set("filters[commodity]", commodity)
  if (state) params.set("filters[state.keyword]", state)
  if (market) params.set("filters[market]", market)

  const cacheKey = params.toString()
  const cache = loadCache()
  const now = Date.now()
  if (cache[cacheKey] && now - cache[cacheKey].at < CACHE_TTL) {
    return { prices: cache[cacheKey].prices, source: "agmarknet", cached: true }
  }

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    const data = await res.json()
    if (data.error) return { error: data.error }

    const records = data.records || []
    const prices = records.map((r) => {
      const min = parseFloat(r.min_price) || 0
      const max = parseFloat(r.max_price) || 0
      const modal = parseFloat(r.modal_price) || 0
      const dateParts = (r.arrival_date || "").split("/")
      const date = dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : r.arrival_date || ""
      return {
        crop: r.commodity || "",
        variety: r.variety || "",
        grade: r.grade || "",
        market: r.market || "",
        district: r.district || "",
        state: r.state || "",
        price: modal || max || min,
        minPrice: min,
        maxPrice: max,
        unit: "quintal",
        date,
      }
    })

    const result = { prices, source: "agmarknet" }
    cache[cacheKey] = { at: now, prices }
    saveCache(cache)
    return result
  } catch (err) {
    return { error: "Failed to fetch live prices. Check internet connection." }
  }
}

export async function fetchMandiPrices({ state, market, crop, limit = 20 }) {
  return fetchFromAgmarknet({ state, market, crop, limit })
}

export async function fetchNearbyMandiPrices({ nearbyMandis, crop }) {
  const allPrices = []
  const mandisToFetch = nearbyMandis.filter((m) => m.hasCrop).slice(0, 4)

  for (const mandi of mandisToFetch) {
    const result = await fetchMandiPrices({
      state: mandi.state,
      market: mandi.name,
      crop,
      limit: 5,
    })
    if (result.prices && result.prices.length > 0) {
      result.prices.forEach((p) => allPrices.push({ ...p, distance: Math.round(mandi.distance) }))
    }
  }

  if (allPrices.length > 0) return { prices: allPrices, source: "agmarknet" }

  if (crop && nearbyMandis.length > 0) {
    const state = nearbyMandis[0].state
    const result = await fetchMandiPrices({ state, crop, limit: 15 })
    if (result.prices && result.prices.length > 0) {
      const statePrices = result.prices.slice(0, 5).map((p) => ({
        ...p,
        distance: Math.round((nearbyMandis[0]?.distance || 0) + 20),
      }))
      return { prices: statePrices, source: "agmarknet" }
    }
  }

  return { prices: [], source: "agmarknet" }
}

export function getLivePriceString(crop, prices) {
  if (!prices || prices.length === 0) return ""
  const matches = prices.filter((p) =>
    (p.crop || "").toLowerCase().includes((crop || "").toLowerCase())
  )
  const list = matches.length > 0 ? matches : prices
  const top = list.slice(0, 4)
  return top
    .map((p) => `${p.market} (${p.state}): ₹${p.price}/quintal${p.date ? ` on ${p.date}` : ""}`)
    .join("; ")
}