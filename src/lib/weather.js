const WEATHER_KEY = "kh_weather_key"

export function getApiKey() {
  return localStorage.getItem(WEATHER_KEY) || ""
}

export function setApiKey(key) {
  localStorage.setItem(WEATHER_KEY, key)
}

export async function fetchWeather(lat, lng) {
  const key = getApiKey()
  if (!key) return null
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${key}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || "",
      rainfall: data.rain?.["1h"] || 0,
      windSpeed: Math.round(data.wind.speed * 3.6),
      icon: data.weather[0]?.icon || "01d",
      name: data.name,
    }
  } catch {
    return null
  }
}
