const SENSOR_KEY = "kh_sensor_data"

export function getSensorData() {
  try {
    return JSON.parse(localStorage.getItem(SENSOR_KEY) || "null")
  } catch {
    return null
  }
}

export function saveSensorData(data) {
  localStorage.setItem(SENSOR_KEY, JSON.stringify({
    ...data,
    lastUpdated: new Date().toISOString(),
  }))
}

export function getMockSensorData() {
  return {
    soilPH: 6.8,
    soilMoisture: 42,
    nitrogen: 28,
    phosphorus: 18,
    potassium: 165,
    soilTemperature: 24,
    sunlightHours: 7.5,
    rainfall: 12,
    lastUpdated: new Date().toISOString(),
  }
}

export function formatSensorForAI(sensorData, envData) {
  if (!sensorData && !envData) return "No soil or sensor data available."
  const parts = []
  if (sensorData) {
    parts.push(`Soil pH: ${sensorData.soilPH}`)
    parts.push(`Soil moisture: ${sensorData.soilMoisture}%`)
    parts.push(`Nitrogen (N): ${sensorData.nitrogen} kg/ha`)
    parts.push(`Phosphorus (P): ${sensorData.phosphorus} kg/ha`)
    parts.push(`Potassium (K): ${sensorData.potassium} kg/ha`)
    parts.push(`Soil temperature: ${sensorData.soilTemperature}°C`)
    parts.push(`Sunlight: ${sensorData.sunlightHours} hours/day`)
  }
  if (envData) {
    if (envData.soilType) parts.push(`Soil type: ${envData.soilType}`)
    if (envData.soilCondition) parts.push(`Soil condition: ${envData.soilCondition}`)
    if (envData.vegetation) parts.push(`Vegetation cover: ${envData.vegetation}`)
    if (envData.precipitation) parts.push(`Rainfall: ${envData.precipitation} mm/month`)
    if (envData.notes) parts.push(`Land notes: ${envData.notes}`)
  }
  return parts.join("\n")
}
