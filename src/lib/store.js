const FARMERS_KEY = "kh_farmers_v1"
const STATUSES_KEY = "kh_statuses_v1"
const ENV_KEY = "kh_env_v1"
const PHOTOS_KEY = "kh_photos_v1"
const PRICES_KEY = "kh_prices_v1"

export const STATUS_OPTIONS = {
  claimed: "Claimed",
  available: "Available",
  "not-applicable": "Not applicable",
  "not-checked": "Not checked",
}

export const SOIL_TYPES = [
  "Clay",
  "Loam",
  "Sandy",
  "Silt",
  "Peat",
  "Chalk",
  "Unknown",
]

export const SOIL_CONDITIONS = ["Good", "Average", "Poor"]

export const VEGETATION_LEVELS = ["None", "Sparse", "Moderate", "Dense"]

export const CROP_RATES = {
  Wheat: 2275,
  Rice: 2183,
  Maize: 1962,
  Cotton: 6620,
  Soybean: 4600,
  Sugarcane: 3150,
  Potato: 1200,
  Tomato: 1500,
  Onion: 1100,
  "Mustard/rapeseed": 5050,
  Gram: 5335,
  Pulses: 6600,
  Groundnut: 5775,
  Sunflower: 6460,
  Barley: 1700,
  Vegetables: 1400,
  Fruits: 1800,
  "Other (enter below)": 0,
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFarmers() {
  return read(FARMERS_KEY, [])
}

export function getFarmer(id) {
  return getFarmers().find((f) => f.id === id)
}

export function addFarmer({ name, village, crop, location }) {
  const farmers = getFarmers()
  const farmer = {
    id: crypto.randomUUID(),
    name,
    village,
    crop,
    location: location || null,
    addedAt: new Date().toISOString(),
  }
  write(FARMERS_KEY, [farmer, ...farmers])
  return farmer
}

export function getStatuses() {
  return read(STATUSES_KEY, {})
}

export function getStatus(farmerId, facilityId) {
  const all = getStatuses()
  return all[`${farmerId}:${facilityId}`] || "not-checked"
}

export function setStatus(farmerId, facilityId, status) {
  const all = getStatuses()
  all[`${farmerId}:${facilityId}`] = status
  write(STATUSES_KEY, all)
}

export function getEnvData(farmerId) {
  const all = read(ENV_KEY, {})
  return all[farmerId] || null
}

export function saveEnvData(farmerId, data) {
  const all = read(ENV_KEY, {})
  all[farmerId] = { ...data, updatedAt: new Date().toISOString() }
  write(ENV_KEY, all)
}

export function getPhotos(farmerId) {
  const all = read(PHOTOS_KEY, {})
  return all[farmerId] || []
}

export function addPhoto(farmerId, photoDataUrl) {
  const all = read(PHOTOS_KEY, {})
  const photos = all[farmerId] || []
  photos.unshift({
    id: crypto.randomUUID(),
    dataUrl: photoDataUrl,
    takenAt: new Date().toISOString(),
  })
  all[farmerId] = photos.slice(0, 10)
  write(PHOTOS_KEY, all)
}

export function removePhoto(farmerId, photoId) {
  const all = read(PHOTOS_KEY, {})
  all[farmerId] = (all[farmerId] || []).filter((p) => p.id !== photoId)
  write(PHOTOS_KEY, all)
}

export function getCropPricing(farmerId) {
  const all = read(PRICES_KEY, {})
  return all[farmerId] || null
}

export function saveCropPricing(farmerId, data) {
  const all = read(PRICES_KEY, {})
  all[farmerId] = { ...data, updatedAt: new Date().toISOString() }
  write(PRICES_KEY, all)
}
