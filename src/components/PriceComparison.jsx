import { useState } from "react"
import { getCropPricing } from "../lib/store"
import { getMSP, getMandiPrices } from "../lib/mandi"
import { useTranslation } from "../lib/useTranslation"

export default function PriceComparison({ farmerId, farmerCrop }) {
  const { t } = useTranslation()
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
        {t("addCropForComparison")}
      </div>
    )
  }

  const rows = [
    msp && {
      label: t("govtMsp"),
      value: msp,
      color: "text-primary",
      note: t("noBuyerShouldPay"),
    },
    avgMandi && {
      label: t("avgMandiPrice"),
      value: avgMandi,
      color: "text-info",
      note: t("fromMarkets", { count: mandi.length }),
    },
    pricing?.estimatedValue &&
      pricing.quantity > 0 && {
        label: t("yourEstValue"),
        value: Math.round(pricing.estimatedValue / pricing.quantity),
        color: "text-success",
        note: `${pricing.cropType} × ${pricing.quantity} ${pricing.unit || t("kg")}`,
      },
  ].filter(Boolean)

  if (rows.length === 0) {
    return (
      <div className="rounded-box bg-base-200 p-4 text-sm text-base-content/60">
        {t("noPricingData")}
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
              {t("mandiBelowMsp", { avgMandi, msp })}
            </p>
          ) : (
            <p className="text-base-content/80">
              {t("mandiAboveMsp", { avgMandi, msp })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
