import { FACILITIES } from "./facilities"

const CROP_FACILITY_MAP = {
  Wheat: ["fertilizer", "crop-insurance", "soil-card", "kcc", "solar-pump"],
  Rice: ["fertilizer", "crop-insurance", "soil-card", "kcc", "solar-pump"],
  Maize: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Cotton: ["fertilizer", "crop-insurance", "soil-card", "kcc", "drone-spraying"],
  Soybean: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Sugarcane: ["fertilizer", "crop-insurance", "soil-card", "kcc", "solar-pump", "drone-spraying"],
  Potato: ["fertilizer", "crop-insurance", "soil-card", "kcc", "drone-spraying"],
  Tomato: ["fertilizer", "crop-insurance", "soil-card", "kcc", "drone-spraying"],
  Onion: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  "Mustard/rapeseed": ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Gram: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Pulses: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Groundnut: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Sunflower: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Barley: ["fertilizer", "crop-insurance", "soil-card", "kcc"],
  Vegetables: ["fertilizer", "crop-insurance", "soil-card", "kcc", "drone-spraying"],
  Fruits: ["fertilizer", "crop-insurance", "soil-card", "kcc", "drone-spraying"],
}

export function matchFacilities(farmerCrop) {
  if (!farmerCrop) return FACILITIES.map((f) => f.id)
  const firstCrop = farmerCrop.split(",")[0].trim()
  const matched = CROP_FACILITY_MAP[firstCrop]
  if (matched) return matched
  return FACILITIES.map((f) => f.id)
}

export function getUnclaimedFacilities(farmerCrop, getStatusFn, farmerId) {
  const all = matchFacilities(farmerCrop)
  return all.filter((id) => {
    const status = getStatusFn(farmerId, id)
    return status === "not-checked" || status === "available"
  })
}
