import { useState } from "react"
import { CROP_RATES, getCropPricing, saveCropPricing } from "../lib/store"

export default function CropCalculator({ farmerId, defaultCrop }) {
  const saved = getCropPricing(farmerId)
  const [cropType, setCropType] = useState(saved?.cropType || defaultCrop || "Wheat")
  const [otherCrop, setOtherCrop] = useState(saved?.otherCrop || "")
  const [quantity, setQuantity] = useState(saved?.quantity || "")
  const [unit, setUnit] = useState(saved?.unit || "kg")
  const [quality, setQuality] = useState(saved?.quality || "Good")

  const rate = CROP_RATES[cropType] || 0
  const qty = parseFloat(quantity) || 0
  const value = qty * rate

  const handleSave = () => {
    saveCropPricing(farmerId, {
      cropType,
      otherCrop,
      quantity: qty,
      unit,
      quality,
      estimatedValue: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">Crop type</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          >
            {Object.keys(CROP_RATES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">Quantity</span>
          </span>
          <input
            type="number"
            className="input input-bordered input-sm"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 500"
          />
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">Unit</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option>kg</option>
            <option>quintal</option>
            <option>tonne</option>
          </select>
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">Quality</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option>Premium</option>
            <option>Good</option>
            <option>Average</option>
            <option>Below average</option>
          </select>
        </label>
      </div>

      {cropType === "Other (enter below)" && (
        <input
          className="input input-bordered input-sm w-full"
          value={otherCrop}
          onChange={(e) => setOtherCrop(e.target.value)}
          placeholder="Enter crop name"
        />
      )}

      <div className="rounded-box bg-primary/10 border border-primary/30 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-base-content/60">
          Estimated market value
        </p>
        <p className="text-3xl font-display font-extrabold text-primary mt-1">
          {value > 0
            ? `₹${value.toLocaleString("en-IN")}`
            : "Enter quantity to calculate"}
        </p>
        <p className="text-xs text-base-content/60 mt-1">
          Based on {cropType !== "Other (enter below)" ? cropType : otherCrop} at ₹{rate}/kg &middot; {quality} quality
        </p>
        <p className="text-xs text-base-content/50 mt-1">
          This is an estimate. Actual price depends on market, location, and buyer.
        </p>
      </div>

      <button className="btn btn-primary btn-sm" onClick={handleSave}>
        Save this calculation
      </button>
    </div>
  )
}
