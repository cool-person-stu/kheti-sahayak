import { getMandiPrices, getMSP } from "../lib/mandi"
import { useTranslation } from "../lib/useTranslation"

export default function MandiPrices({ crop }) {
  const { t } = useTranslation()
  const prices = getMandiPrices(crop)
  const msp = getMSP(crop)

  return (
    <div className="space-y-3">
      {msp && (
        <div className="rounded-box bg-primary/10 border border-primary/30 p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-display font-bold text-sm">
            MSP
          </div>
          <div>
            <p className="text-xs text-base-content/60">
              {t("govtFloor")}
            </p>
            <p className="font-display font-bold text-primary">
              ₹{msp.toLocaleString("en-IN")}/{t("quintal")}
            </p>
            <p className="text-xs text-base-content/60">
              {t("noBuyerLess")}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="text-xs text-base-content/60">
              <th>{t("market")}</th>
              <th>{t("state")}</th>
              <th className="text-right">{t("pricePerQuintal")}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p, i) => (
              <tr key={i} className="hover">
                <td className="font-medium">{p.market}</td>
                <td className="text-base-content/70">{p.state}</td>
                <td className="text-right font-display font-bold text-primary">
                  ₹{p.price.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-base-content/50">
        {t("indicative")} {t("livePrices")}{" "}
        <a
          href="https://agmarknet.gov.in"
          target="_blank"
          rel="noreferrer"
          className="link link-primary"
        >
          agmarknet.gov.in
        </a>
      </p>
    </div>
  )
}
