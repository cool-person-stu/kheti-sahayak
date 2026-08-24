export const MANDI_PRICES = [
  { crop: "Wheat", price: 2275, unit: "quintal", market: "Indore", state: "MP" },
  { crop: "Wheat", price: 2180, unit: "quintal", market: "Jaipur", state: "Rajasthan" },
  { crop: "Wheat", price: 2320, unit: "quintal", market: "Ludhiana", state: "Punjab" },
  { crop: "Rice (Paddy)", price: 2183, unit: "quintal", market: "Karnal", state: "Haryana" },
  { crop: "Rice (Paddy)", price: 2150, unit: "quintal", market: "Hyderabad", state: "Telangana" },
  { crop: "Rice (Paddy)", price: 2200, unit: "quintal", market: "Kolkata", state: "WB" },
  { crop: "Maize", price: 1962, unit: "quintal", market: "Nashik", state: "Maharashtra" },
  { crop: "Maize", price: 1900, unit: "quintal", market: "Raipur", state: "Chhattisgarh" },
  { crop: "Cotton", price: 6620, unit: "quintal", market: "Rajkot", state: "Gujarat" },
  { crop: "Cotton", price: 6500, unit: "quintal", market: "Adilabad", state: "Telangana" },
  { crop: "Soybean", price: 4600, unit: "quintal", market: "Indore", state: "MP" },
  { crop: "Soybean", price: 4550, unit: "quintal", market: "Latur", state: "Maharashtra" },
  { crop: "Sugarcane", price: 315, unit: "quintal", market: "Kolhapur", state: "Maharashtra" },
  { crop: "Sugarcane", price: 325, unit: "quintal", market: "Muzaffarnagar", state: "UP" },
  { crop: "Potato", price: 1200, unit: "quintal", market: "Agra", state: "UP" },
  { crop: "Potato", price: 1150, unit: "quintal", market: "Indore", state: "MP" },
  { crop: "Tomato", price: 1500, unit: "quintal", market: "Pune", state: "Maharashtra" },
  { crop: "Tomato", price: 1600, unit: "quintal", market: "Bangalore", state: "Karnataka" },
  { crop: "Onion", price: 1100, unit: "quintal", market: "Nashik", state: "Maharashtra" },
  { crop: "Onion", price: 1050, unit: "quintal", market: "Indore", state: "MP" },
  { crop: "Gram", price: 5335, unit: "quintal", market: "Jaipur", state: "Rajasthan" },
  { crop: "Pulses", price: 6600, unit: "quintal", market: "Delhi", state: "Delhi" },
  { crop: "Groundnut", price: 5775, unit: "quintal", market: "Junagadh", state: "Gujarat" },
  { crop: "Mustard", price: 5050, unit: "quintal", market: "Jaipur", state: "Rajasthan" },
  { crop: "Barley", price: 1700, unit: "quintal", market: "Jaipur", state: "Rajasthan" },
]

export const MSP_PRICES = {
  Wheat: 2275,
  Rice: 2183,
  Maize: 1962,
  Cotton: 6620,
  Soybean: 4600,
  Sugarcane: 315,
  Potato: 0,
  Tomato: 0,
  Onion: 0,
  "Mustard/rapeseed": 5050,
  Gram: 5335,
  Pulses: 6600,
  Groundnut: 5775,
  Sunflower: 6460,
  Barley: 1700,
}

export function getMandiPrices(crop) {
  if (!crop) return MANDI_PRICES.slice(0, 10)
  const first = crop.split(",")[0].trim().toLowerCase()
  const matches = MANDI_PRICES.filter(
    (p) => p.crop.toLowerCase().includes(first)
  )
  return matches.length > 0 ? matches : MANDI_PRICES.slice(0, 5)
}

export function getMSP(crop) {
  if (!crop) return null
  const first = crop.split(",")[0].trim()
  return MSP_PRICES[first] || null
}
