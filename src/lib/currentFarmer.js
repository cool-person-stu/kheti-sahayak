const CURRENT_KEY = "kh_current_farmer"

export function getCurrentFarmer() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null")
  } catch {
    return null
  }
}

export function setCurrentFarmer(farmer) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(farmer))
}

export function clearCurrentFarmer() {
  localStorage.removeItem(CURRENT_KEY)
}
