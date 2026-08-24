const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || ""

export function getAIKey() {
  return GEMINI_KEY
}

export async function askAI({ question, farmerData, sensorData, weatherData, cropPricing, language, chatHistory }) {
  const apiKey = getAIKey()
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") return { error: "AI not configured. Please set the Gemini API key in the device settings." }

  const systemPrompt = `You are Annadata AI, a helpful farming assistant for Indian farmers.

CRITICAL RULE: You MUST respond EXCLUSIVELY in ${language}. Do NOT use English or any other language in your response. Every single word must be in ${language}. Use the native script of ${language} (e.g. Devanagari for Hindi, Bengali script for Bengali, Telugu script for Telugu, Tamil script for Tamil, etc.).

You are warm, practical, and give actionable advice. Use ₹ for currency. Keep responses concise but thorough (2-4 short paragraphs). Focus on: crop planning, soil health, weather-based advice, market timing, pest management, water management, and government schemes. When data is provided (soil sensors, weather, crop prices), use it to give specific, personalized advice.

If the farmer writes in a different language, still respond in ${language} as instructed.`

  const contextParts = []
  if (farmerData) {
    contextParts.push(`Farmer: ${farmerData.name} from ${farmerData.village}`)
    contextParts.push(`Crop: ${farmerData.crop || "Not specified"}`)
    contextParts.push(`Land: ${farmerData.landSize} ${farmerData.landUnit}`)
  }
  if (sensorData) contextParts.push(`Soil Sensor Data:\n${sensorData}`)
  if (weatherData) contextParts.push(`Weather: ${weatherData.temp}°C, ${weatherData.description}, Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} km/h`)
  if (cropPricing) contextParts.push(`Nearby mandi prices: ${cropPricing}`)

  const context = contextParts.length > 0 ? `\n\nFarmer Context:\n${contextParts.join("\n")}` : ""

  const messages = [
    { role: "user", parts: [{ text: systemPrompt + context }] },
    { role: "model", parts: [{ text: `नमस्ते! मैं अन्नदाता एआई हूँ। मैं आपकी भाषा में जवाब दूँगा।` }] },
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
    question: `Based on the provided data, give me 5 specific, actionable recommendations for this farmer. Cover: 1) What crops to plant now and when, 2) Soil improvements needed, 3) Water/irrigation advice, 4) Weather-based precautions for the next 2 weeks, 5) Best time to harvest and sell. Be specific with numbers and dates where possible. REMINDER: You MUST respond entirely in ${language}.`,
    farmerData,
    sensorData,
    weatherData,
    cropPricing,
    language,
    chatHistory: [],
  })
}
