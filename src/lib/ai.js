const AI_KEY = "kh_ai_key"

export function getAIKey() {
  return localStorage.getItem(AI_KEY) || ""
}

export function setAIKey(key) {
  localStorage.setItem(AI_KEY, key)
}

export async function askAI({ question, farmerData, sensorData, weatherData, cropPricing, language, chatHistory }) {
  const apiKey = getAIKey()
  if (!apiKey) return { error: "AI key not set" }

  const systemPrompt = `You are Annadata AI, a helpful farming assistant for Indian farmers. You speak in the farmer's language (${language}). You are warm, practical, and give actionable advice. Always respond in the same language the farmer uses. Keep responses concise but thorough. Use ₹ for currency. Focus on: crop planning, soil health, weather-based advice, market timing, pest management, water management, and government schemes. When data is provided (soil sensors, weather, crop prices), use it to give specific, personalized advice.`

  const contextParts = []
  if (farmerData) {
    contextParts.push(`Farmer: ${farmerData.name} from ${farmerData.village}`)
    contextParts.push(`Crop: ${farmerData.crop || "Not specified"}`)
    contextParts.push(`Land: ${farmerData.landSize} ${farmerData.landUnit}`)
  }
  if (sensorData) contextParts.push(`Soil Sensor Data:\n${sensorData}`)
  if (weatherData) contextParts.push(`Weather: ${weatherData.temp}°C, ${weatherData.description}, Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} km/h`)
  if (cropPricing) contextParts.push(`Crop pricing: ${cropPricing}`)

  const context = contextParts.length > 0 ? `\n\nContext:\n${contextParts.join("\n")}` : ""

  const messages = [
    { role: "user", parts: [{ text: systemPrompt + context }] },
    { role: "model", parts: [{ text: "I understand. I am Annadata AI, ready to help the farmer with personalized advice in their language." }] },
  ]

  if (chatHistory) {
    chatHistory.slice(-6).forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })
    })
  }

  messages.push({ role: "user", parts: [{ text: question }] })

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: messages }),
      }
    )
    const data = await res.json()
    if (data.error) return { error: data.error.message || "AI request failed" }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return { text: text || "No response from AI" }
  } catch (err) {
    return { error: "Failed to connect to AI. Check your internet connection." }
  }
}

export async function getSmartSuggestions({ farmerData, sensorData, weatherData, cropPricing, language }) {
  return askAI({
    question: `Based on the provided data, give me 5 specific, actionable recommendations for this farmer. Cover: 1) What crops to plant现在 and when, 2) Soil improvements needed, 3) Water/irrigation advice, 4) Weather-based precautions for the next 2 weeks, 5) Best time to harvest and sell. Be specific with numbers and dates where possible.`,
    farmerData,
    sensorData,
    weatherData,
    cropPricing,
    language,
    chatHistory: [],
  })
}
