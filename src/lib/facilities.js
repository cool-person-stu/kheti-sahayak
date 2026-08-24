export const FACILITY_KEYS = {
  fertilizer:    { name: "fFertilizerName",    benefit: "fFertilizerBenefit",    what: "fFertilizerWhat",    next: "fFertilizerNext" },
  "crop-insurance": { name: "fCropInsuranceName", benefit: "fCropInsuranceBenefit", what: "fCropInsuranceWhat", next: "fCropInsuranceNext" },
  "soil-card":   { name: "fSoilCardName",     benefit: "fSoilCardBenefit",     what: "fSoilCardWhat",     next: "fSoilCardNext" },
  kcc:           { name: "fKccName",           benefit: "fKccBenefit",           what: "fKccWhat",           next: "fKccNext" },
  "solar-pump":  { name: "fSolarPumpName",    benefit: "fSolarPumpBenefit",    what: "fSolarPumpWhat",    next: "fSolarPumpNext" },
  "drone-spraying": { name: "fDroneName",      benefit: "fDroneBenefit",      what: "fDroneWhat",      next: "fDroneNext" },
}

export const FACILITIES = [
  {
    id: "fertilizer",
    name: "Fertilizer Subsidy",
    benefit: "Cheaper fertilizer for your fields",
    whatItGives:
      "When you buy fertilizer from a registered shop, the government pays part of the cost for you.",
    nextSteps:
      "Take your Kisan identity (land records or Aadhaar) to a registered fertilizer shop and ask for the subsidy price.",
  },
  {
    id: "crop-insurance",
    name: "Crop Insurance (PMFBY)",
    benefit: "Money back if your crops fail",
    whatItGives:
      "If heavy rain, drought, or pests destroy your crop, the scheme pays you compensation for your loss.",
    nextSteps:
      "Before the planting season ends, visit your village agriculture officer or nearest bank branch to enrol. Premium is very low.",
  },
  {
    id: "soil-card",
    name: "Soil Health Card",
    benefit: "Free soil testing for your farm",
    whatItGives:
      "The government tests your soil for free and tells you exactly which fertilizer your field needs.",
    nextSteps:
      "Ask your village agriculture officer for a soil sample kit, collect samples from your fields, and submit them.",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    benefit: "A loan card for seeds and tools",
    whatItGives:
      "A bank card that lets you borrow money cheaply to buy seeds, fertilizer, and equipment, and repay after harvest.",
    nextSteps:
      "Go to your nearest bank with identity and land documents and ask to apply for a Kisan Credit Card.",
  },
  {
    id: "solar-pump",
    name: "Solar Water Pump Subsidy",
    benefit: "Grant for a solar water pump",
    whatItGives:
      "The government pays a large part of the cost of installing a solar pump, so watering your field becomes free.",
    nextSteps:
      "Apply through your state's renewable energy office or agriculture department website with land documents.",
  },
  {
    id: "drone-spraying",
    name: "Drone Spraying Subsidy",
    benefit: "Grant for renting crop-spraying drones",
    whatItGives:
      "You can hire a drone to spray your crop at a much cheaper price because the government covers part of the cost.",
    nextSteps:
      "Check with your agriculture officer or a drone service provider in your area for subsidy-eligible bookings.",
  },
]
