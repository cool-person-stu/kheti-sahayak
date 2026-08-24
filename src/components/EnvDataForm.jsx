import { useState } from "react"
import {
  getEnvData,
  saveEnvData,
  SOIL_TYPES,
  SOIL_CONDITIONS,
  VEGETATION_LEVELS,
} from "../lib/store"
import { useTranslation } from "../lib/useTranslation"

export default function EnvDataForm({ farmerId }) {
  const { t } = useTranslation()
  const saved = getEnvData(farmerId)
  const [soilType, setSoilType] = useState(saved?.soilType || "")
  const [soilCondition, setSoilCondition] = useState(saved?.soilCondition || "")
  const [vegetation, setVegetation] = useState(saved?.vegetation || "")
  const [precipitation, setPrecipitation] = useState(saved?.precipitation || "")
  const [notes, setNotes] = useState(saved?.notes || "")
  const [saved2, setSaved2] = useState(!!saved)

  const handleSave = () => {
    saveEnvData(farmerId, {
      soilType,
      soilCondition,
      vegetation,
      precipitation,
      notes,
    })
    setSaved2(true)
    setTimeout(() => setSaved2(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">{t("soilType")}</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={soilType}
            onChange={(e) => { setSoilType(e.target.value); setSaved2(false) }}
          >
            <option value="">{t("pickOne")}</option>
            {SOIL_TYPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">{t("soilCondition")}</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={soilCondition}
            onChange={(e) => { setSoilCondition(e.target.value); setSaved2(false) }}
          >
            <option value="">{t("pickOne")}</option>
            {SOIL_CONDITIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">{t("vegetation")}</span>
          </span>
          <select
            className="select select-bordered select-sm"
            value={vegetation}
            onChange={(e) => { setVegetation(e.target.value); setSaved2(false) }}
          >
            <option value="">{t("pickOne")}</option>
            {VEGETATION_LEVELS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="form-control col-span-2 sm:col-span-1">
          <span className="label">
            <span className="label-text text-xs font-semibold">{t("rainfall")}</span>
          </span>
          <input
            type="number"
            className="input input-bordered input-sm"
            value={precipitation}
            onChange={(e) => { setPrecipitation(e.target.value); setSaved2(false) }}
            placeholder={t("enterQuantity")}
          />
        </label>
      </div>

      <label className="form-control w-full">
        <span className="label">
          <span className="label-text text-xs font-semibold">{t("landNotes")}</span>
        </span>
        <textarea
          className="textarea textarea-bordered textarea-sm min-h-[60px]"
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setSaved2(false) }}
          placeholder={t("notesPlaceholder")}
        />
      </label>

      <button className="btn btn-primary btn-sm" onClick={handleSave}>
        {saved2 ? t("saved") : t("saveEnvData")}
      </button>
    </div>
  )
}
