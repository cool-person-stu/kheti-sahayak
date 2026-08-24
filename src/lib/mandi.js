const MANDI_DB = [
  { id: "ap-hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, crops: ["Rice", "Cotton", "Maize", "Turmeric"] },
  { id: "ap-vijayawada", name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.648, crops: ["Rice", "Chilli", "Tobacco"] },
  { id: "ap-guntur", name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lng: 80.4365, crops: ["Chilli", "Cotton", "Tobacco"] },
  { id: "ar-guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, crops: ["Rice", "Tea", "Jute"] },
  { id: "br-patna", name: "Patna", state: "Bihar", lat: 25.6093, lng: 85.1376, crops: ["Rice", "Wheat", "Maize", "Litchi"] },
  { id: "br-muzaffarpur", name: "Muzaffarpur", state: "Bihar", lat: 26.1209, lng: 85.3647, crops: ["Litchi", "Rice", "Wheat"] },
  { id: "cg-raipur", name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296, crops: ["Rice", "Maize", "Soybean"] },
  { id: "goa-panaji", name: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278, crops: ["Rice", "Coconut"] },
  { id: "gj-ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, crops: ["Cotton", "Groundnut", "Tobacco"] },
  { id: "gj-rajkot", name: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022, crops: ["Cotton", "Groundnut", "Castor"] },
  { id: "gj-junagadh", name: "Junagadh", state: "Gujarat", lat: 21.5222, lng: 70.4787, crops: ["Groundnut", "Cotton", "Tobacco"] },
  { id: "hr-karnal", name: "Karnal", state: "Haryana", lat: 29.6857, lng: 76.9905, crops: ["Rice", "Wheat", "Mustard"] },
  { id: "hr-hisar", name: "Hisar", state: "Haryana", lat: 29.1492, lng: 75.7217, crops: ["Wheat", "Cotton", "Mustard"] },
  { id: "hp-shimla", name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, crops: ["Apple", "Potato", "Maize"] },
  { id: "jk-srinagar", name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973, crops: ["Apple", "Rice", "Saffron"] },
  { id: "jh-ranchi", name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096, crops: ["Rice", "Maize", "Pulses"] },
  { id: "ka-bangalore", name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946, crops: ["Rice", "Ragi", "Maize", "Turmeric"] },
  { id: "ka-mysore", name: "Mysore", state: "Karnataka", lat: 12.2958, lng: 76.6394, crops: ["Rice", "Ragi", "Sugarcane"] },
  { id: "ka-hubli", name: "Hubli", state: "Karnataka", lat: 15.3647, lng: 75.124, crops: ["Cotton", "Groundnut", "Maize"] },
  { id: "kl-kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, crops: ["Coconut", "Spices", "Rubber"] },
  { id: "kl-thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366, crops: ["Coconut", "Rubber", "Spices"] },
  { id: "mp-indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577, crops: ["Soybean", "Wheat", "Onion", "Potato"] },
  { id: "mp-bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, crops: ["Wheat", "Soybean", "Chickpea"] },
  { id: "mp-jabalpur", name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lng: 79.9864, crops: ["Wheat", "Rice", "Soybean"] },
  { id: "mh-mumbai", name: "Mumbai (Vashi)", state: "Maharashtra", lat: 19.076, lng: 72.8777, crops: ["Onion", "Potato", "Tomato"] },
  { id: "mh-pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, crops: ["Onion", "Tomato", "Grapes"] },
  { id: "mh-nashik", name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, crops: ["Onion", "Grapes", "Tomato"] },
  { id: "mh-nagpur", name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, crops: ["Orange", "Cotton", "Soybean"] },
  { id: "mh-latur", name: "Latur", state: "Maharashtra", lat: 18.4088, lng: 76.5601, crops: ["Soybean", "Pigeon Pea", "Cotton"] },
  { id: "mh-kolhapur", name: "Kolhapur", state: "Maharashtra", lat: 16.705, lng: 74.2433, crops: ["Sugarcane", "Jowar", "Rice"] },
  { id: "ml-shillong", name: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933, crops: ["Rice", "Maize", "Potato"] },
  { id: "mn-imphal", name: "Imphal", state: "Manipur", lat: 24.817, lng: 93.9368, crops: ["Rice", "Mustard", "Sugarcane"] },
  { id: "mz-aizawl", name: "Aizawl", state: "Mizoram", lat: 23.7271, lng: 92.7176, crops: ["Rice", "Maize", "Ginger"] },
  { id: "nl-kohima", name: "Kohima", state: "Nagaland", lat: 25.6586, lng: 94.1086, crops: ["Rice", "Maize", "Cardamom"] },
  { id: "od-bhubaneswar", name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245, crops: ["Rice", "Maize", "Sugarcane"] },
  { id: "pb-ludhiana", name: "Ludhiana", state: "Punjab", lat: 30.901, lng: 75.8573, crops: ["Wheat", "Rice", "Maize"] },
  { id: "pb-amritsar", name: "Amritsar", state: "Punjab", lat: 31.634, lng: 74.8723, crops: ["Wheat", "Rice"] },
  { id: "py-pondicherry", name: "Pondicherry", state: "Puducherry", lat: 11.9416, lng: 79.8083, crops: ["Rice", "Groundnut"] },
  { id: "rj-jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, crops: ["Wheat", "Mustard", "Gram", "Barley"] },
  { id: "rj-jodhpur", name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243, crops: ["Gram", "Mustard", "Cumin"] },
  { id: "sk-gangtok", name: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065, crops: ["Rice", "Maize", "Cardamom"] },
  { id: "tn-chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, crops: ["Rice", "Groundnut", "Sugarcane"] },
  { id: "tn-madurai", name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198, crops: ["Rice", "Cotton", "Groundnut"] },
  { id: "tg-warangal", name: "Warangal", state: "Telangana", lat: 17.9784, lng: 79.5941, crops: ["Rice", "Cotton", "Turmeric"] },
  { id: "tr-agartala", name: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868, crops: ["Rice", "Rubber", "Jackfruit"] },
  { id: "up-lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, crops: ["Wheat", "Rice", "Sugarcane"] },
  { id: "up-agra", name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, crops: ["Wheat", "Potato", "Mustard"] },
  { id: "up-varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, crops: ["Wheat", "Rice", "Mango"] },
  { id: "up-muzaffarnagar", name: "Muzaffarnagar", state: "Uttar Pradesh", lat: 29.4727, lng: 77.7069, crops: ["Sugarcane", "Wheat", "Mustard"] },
  { id: "ut-dehradun", name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322, crops: ["Rice", "Wheat", "Litchi"] },
  { id: "wb-kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, crops: ["Rice", "Jute", "Potato"] },
  { id: "wb-siliguri", name: "Siliguri", state: "West Bengal", lat: 26.7271, lng: 88.3953, crops: ["Rice", "Tea", "Jute"] },
  { id: "brx-kokrajhar", name: "Kokrajhar", state: "Assam (BTR)", lat: 26.4013, lng: 90.2714, crops: ["Rice", "Maize", "Betel nut"] },
  { id: "sat-ranchi", name: "Ranchi (Santali belt)", state: "Jharkhand", lat: 23.35, lng: 85.5, crops: ["Rice", "Maize", "Lentil"] },
  { id: "kok-panaji", name: "Panaji (Konkan)", state: "Goa", lat: 15.4989, lng: 73.8278, crops: ["Rice", "Coconut", "Cashew"] },
  { id: "mni-imphal", name: "Imphal (Manipur)", state: "Manipur", lat: 24.817, lng: 93.9368, crops: ["Rice", "Mustard", "Sugarcane"] },
]

const CROP_ALIASES = {
  wheat: ["Wheat", "Gehun"],
  rice: ["Rice", "Paddy", "Dhan", "Chawal"],
  paddy: ["Rice", "Paddy", "Dhan"],
  maize: ["Maize", "Corn", "Makka"],
  cotton: ["Cotton", "Kapas"],
  soybean: ["Soybean", "Soyabean", "Soya"],
  sugarcane: ["Sugarcane", "Ganna"],
  potato: ["Potato", "Aloo"],
  tomato: ["Tomato", "Tamatar"],
  onion: ["Onion", "Pyaz"],
  gram: ["Gram", "Chickpea", "Chana"],
  pulses: ["Pulses", "Dal", "Dals"],
  groundnut: ["Groundnut", "Peanut", "Moongfali"],
  mustard: ["Mustard", "Sarson", "Rapeseed"],
  barley: ["Barley", "Jau"],
  mango: ["Mango", "Aam"],
  apple: ["Apple", "Seb"],
  coconut: ["Coconut", "Nariyal"],
  spices: ["Spices", "Masala", "Masale"],
  tea: ["Tea", "Chai"],
  coffee: ["Coffee"],
  rubber: ["Rubber", "Rabbar"],
  jute: ["Jute", "Pat"],
  tobacco: ["Tobacco", "Tamakhu"],
  orange: ["Orange", "Narangi"],
  grapes: ["Grapes", "Angoor"],
  litchi: ["Litchi", "Lychee"],
  turmeric: ["Turmeric", "Haldi"],
  chilli: ["Chilli", "Mirchi", "Chili"],
  cardamom: ["Cardamom", "Elaichi"],
  cashew: ["Cashew", "Kaju"],
  betel_nut: ["Betel nut", "Supari"],
  ginger: ["Ginger", "Adrak"],
  castor: ["Castor", "Arandi"],
  cumin: ["Cumin", "Jeera"],
  saffron: ["Saffron", "Kesar"],
  pigeon_pea: ["Pigeon Pea", "Arhar", "Toor"],
  lentil: ["Lentil", "Masoor"],
  ragi: ["Ragi", "Finger millet"],
  jowar: ["Jowar", "Sorghum"],
  jackfruit: ["Jackfruit", "Kathal"],
  mango: ["Mango", "Aam"],
}

export function normalizeCrop(input) {
  if (!input) return ""
  const lower = input.toLowerCase().trim()
  for (const [key, aliases] of Object.entries(CROP_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === lower)) return key
  }
  return lower
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function findNearbyMandi(lat, lng, crop, maxDistanceKm = 200) {
  if (!lat || !lng) return []
  const normalized = normalizeCrop(crop)

  const withDistance = MANDI_DB.map((m) => ({
    ...m,
    distance: haversine(lat, lng, m.lat, m.lng),
    hasCrop: m.crops.some((c) => c.toLowerCase() === normalized || c.toLowerCase().includes(normalized)),
  }))

  return withDistance
    .filter((m) => m.distance <= maxDistanceKm)
    .sort((a, b) => {
      if (a.hasCrop && !b.hasCrop) return -1
      if (!a.hasCrop && b.hasCrop) return 1
      return a.distance - b.distance
    })
    .slice(0, 8)
}

export function findMandiByName(query) {
  if (!query) return []
  const q = query.toLowerCase().trim()
  return MANDI_DB.filter(
    (m) => m.name.toLowerCase().includes(q) || m.state.toLowerCase().includes(q)
  ).slice(0, 5)
}

export function getStateMandis(state) {
  if (!state) return []
  return MANDI_DB.filter((m) => m.state.toLowerCase().includes(state.toLowerCase()))
}

export function getMandiPrices(crop) {
  if (!crop) return MANDI_DB.slice(0, 5).map((m) => ({ crop: crop || "Wheat", price: 2200, unit: "quintal", market: m.name, state: m.state }))
  const normalized = normalizeCrop(crop)
  return MANDI_DB.filter((m) => m.crops.some((c) => c.toLowerCase() === normalized || c.toLowerCase().includes(normalized)))
    .slice(0, 5)
    .map((m) => ({ crop, price: 2200, unit: "quintal", market: m.name, state: m.state }))
}

const MSP_PRICES = {
  Wheat: 2275, Rice: 2183, Maize: 1962, Cotton: 6620, Soybean: 4600,
  Sugarcane: 315, Potato: 0, Tomato: 0, Onion: 0, Mustard: 5050,
  Gram: 5335, Pulses: 6600, Groundnut: 5775, Sunflower: 6460, Barley: 1700,
}

export function getMSP(crop) {
  if (!crop) return null
  const first = crop.split(",")[0].trim()
  return MSP_PRICES[first] || null
}
