import { matchFacilities } from "../lib/matcher"
import { FACILITIES, FACILITY_KEYS } from "../lib/facilities"
import { getStatus } from "../lib/store"
import { useTranslation } from "../lib/useTranslation"

export default function AutoMatch({ farmerId, farmerCrop }) {
  const { t } = useTranslation()
  const matchedIds = matchFacilities(farmerCrop)
  const matched = FACILITIES.filter((f) => matchedIds.includes(f.id))
  const unclaimed = matched.filter(
    (f) => getStatus(farmerId, f.id) !== "claimed"
  )

  const getName = (f) => {
    const keys = FACILITY_KEYS[f.id]
    return keys ? t(keys.name) : f.name
  }
  const getBenefit = (f) => {
    const keys = FACILITY_KEYS[f.id]
    return keys ? t(keys.benefit) : f.benefit
  }

  return (
    <div className="space-y-3">
      {unclaimed.length === 0 ? (
        <div className="rounded-box bg-success/10 border border-success/30 p-4 text-center">
          <p className="font-display text-lg font-bold text-success">
            {t("allClaimed")}
          </p>
          <p className="text-sm text-base-content/60 mt-1">
            {t("allClaimedDesc")}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-box bg-secondary/10 border border-secondary/30 p-3">
            <p className="text-sm text-base-content/80">
              {t("smartMatchFor")}: <strong>{farmerCrop || t("yourCrop")}</strong> —{" "}
              <strong>{unclaimed.length}</strong> {t("unclaimedCount")}
            </p>
          </div>
          <div className="space-y-2">
            {unclaimed.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-3 rounded-box bg-base-200/60"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-display font-bold text-xs shrink-0">
                  {getName(f).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{getName(f)}</p>
                  <p className="text-xs text-base-content/60 truncate">
                    {getBenefit(f)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
