import { useState } from "react"
import { CROP_RATES, getCropPricing, saveCropPricing } from "../lib/store"
import { useTranslation } from "../lib/useTranslation"

export default function CropCalculator({ farmerId, defaultCrop }) {
  const { t } = useTranslation()
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
            <span className="label-text text-xs font-semibold">{t("cropType")}</span>
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
            <span className="label-text text-xs font-semibold">{t("quantity")}</span>
          </span>
          <input
            type="number"
            className="input input-bordered input-sm"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={t("enterQuantity")}
          />
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">{t("unit")}</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option>{t("kg")}</option>
            <option>{t("quintal")}</option>
            <option>{t("tonne")}</option>
          </select>
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">{t("quality")}</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option>{t("premium")}</option>
            <option>{t("good")}</option>
            <option>{t("average")}</option>
            <option>{t("belowAverage")}</option>
          </select>
        </label>
      </div>

      {cropType === "Other (enter below)" && (
        <input
          className="input input-bordered input-sm w-full"
          value={otherCrop}
          onChange={(e) => setOtherCrop(e.target.value)}
          placeholder={t("enterCropName")}
        />
      )}

      <div className="rounded-box bg-primary/10 border border-primary/30 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-base-content/60">
          {t("estimatedValue")}
        </p>
        <p className="text-3xl font-display font-extrabold text-primary mt-1">
          {value > 0
            ? `₹${value.toLocaleString("en-IN")}`
            : t("enterQuantityToCalculate")}
        </p>
        <p className="text-xs text-base-content/60 mt-1">
          {t("basedOnRate", { crop: cropType !== "Other (enter below)" ? cropType : otherCrop, rate, quality })}
        </p>
        <p className="text-xs text-base-content/50 mt-1">
          {t("estimateDisclaimer")}
        </p>
      </div>

      <button className="btn btn-primary btn-sm" onClick={handleSave}>
        {t("saveCalculation")}
      </button>
    </div>
  )
}
