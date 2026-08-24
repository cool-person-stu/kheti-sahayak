import { useState } from "react"
import { getCropPricing } from "../lib/store"
import { getMSP, getMandiPrices } from "../lib/mandi"

export default function PriceComparison({ farmerId, farmerCrop }) {
  const pricing = getCropPricing(farmerId)
  const msp = getMSP(farmerCrop)
  const mandi = getMandiPrices(farmerCrop)
  const avgMandi =
    mandi.length > 0
      ? Math.round(mandi.reduce((a, b) => a + b.price, 0) / mandi.length)
      : null

  if (!farmerCrop) {
    return (
      <div className="rounded-box bg-base-200 p-4 text-sm text-base-content/60">
        Add the farmer's crop to see price comparisons.
      </div>
    )
  }

  const rows = [
    msp && {
      label: "Government MSP (floor price)",
      value: msp,
      color: "text-primary",
      note: "No buyer should pay less",
    },
    avgMandi && {
      label: "Average mandi price",
      value: avgMandi,
      color: "text-info",
      note: `From ${mandi.length} markets`,
    },
    pricing?.estimatedValue &&
      pricing.quantity > 0 && {
        label: "Your estimated value",
        value: Math.round(pricing.estimatedValue / pricing.quantity),
        color: "text-success",
        note: `${pricing.cropType} × ${pricing.quantity} ${pricing.unit || "kg"}`,
      },
  ].filter(Boolean)

  if (rows.length === 0) {
    return (
      <div className="rounded-box bg-base-200 p-4 text-sm text-base-content/60">
        No pricing data yet. Use the crop calculator or check mandi prices above.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-box bg-base-200/60">
          <div>
            <p className="font-semibold text-sm">{r.label}</p>
            <p className="text-xs text-base-content/60">{r.note}</p>
          </div>
          <p className={`font-display text-xl font-extrabold ${r.color}`}>
            ₹{r.value.toLocaleString("en-IN")}
          </p>
        </div>
      ))}

      {msp && avgMandi && (
        <div className="rounded-box bg-warning/10 border border-warning/30 p-3 text-sm">
          {avgMandi < msp ? (
            <p className="text-warning-content font-semibold">
              Current mandi average (₹{avgMandi}) is below MSP (₹{msp}). The farmer should insist on MSP or wait.
            </p>
          ) : (
            <p className="text-base-content/80">
              Current mandi average (₹{avgMandi}) is above MSP (₹{msp}). Good time to sell.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
