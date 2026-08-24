import { useState } from "react"
import { getPhotos } from "../lib/store"

const LISTINGS_KEY = "kh_listings_v1"

function getListings() {
  try {
    return JSON.parse(localStorage.getItem(LISTINGS_KEY) || "[]")
  } catch {
    return []
  }
}

function saveListing(listing) {
  const all = getListings()
  all.unshift(listing)
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all.slice(0, 50)))
}

function removeListing(id) {
  const all = getListings().filter((l) => l.id !== id)
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(all))
}

export default function DirectSale({ farmerId, farmerName, farmerCrop, farmerVillage }) {
  const [listings, setListings] = useState(getListings)
  const [showForm, setShowForm] = useState(false)
  const [crop, setCrop] = useState(farmerCrop || "")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("quintal")
  const [askingPrice, setAskingPrice] = useState("")
  const [notes, setNotes] = useState("")

  const refresh = () => setListings(getListings())

  const handlePublish = () => {
    if (!crop.trim() || !quantity) return
    saveListing({
      id: crypto.randomUUID(),
      farmerId,
      farmerName,
      farmerVillage,
      crop: crop.trim(),
      quantity: parseFloat(quantity),
      unit,
      askingPrice: askingPrice ? parseFloat(askingPrice) : null,
      notes: notes.trim(),
      publishedAt: new Date().toISOString(),
    })
    setQuantity("")
    setAskingPrice("")
    setNotes("")
    setShowForm(false)
    refresh()
  }

  const handleRemove = (id) => {
    removeListing(id)
    refresh()
  }

  return (
    <div className="space-y-4">
      <button
        className="btn btn-primary btn-sm gap-2"
        onClick={() => setShowForm(!showForm)}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
        </svg>
        {showForm ? "Cancel" : "List harvest for sale"}
      </button>

      {showForm && (
        <div className="card bg-base-200/60 p-4 space-y-3">
          <p className="text-sm text-base-content/70">
            Post this farmer's harvest so real buyers can find it.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="form-control col-span-2 sm:col-span-1">
              <span className="label-text text-xs font-semibold">Crop</span>
              <input
                className="input input-bordered input-sm"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              />
            </label>
            <label className="form-control col-span-2 sm:col-span-1">
              <span className="label-text text-xs font-semibold">Quantity</span>
              <input
                type="number"
                className="input input-bordered input-sm"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
              />
            </label>
            <label className="form-control col-span-2 sm:col-span-1">
              <span className="label-text text-xs font-semibold">Unit</span>
              <select className="select select-bordered select-sm" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option>quintal</option>
                <option>kg</option>
                <option>tonne</option>
              </select>
            </label>
            <label className="form-control col-span-2 sm:col-span-1">
              <span className="label-text text-xs font-semibold">Asking price (₹ per {unit})</span>
              <input
                type="number"
                className="input input-bordered input-sm"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="optional"
              />
            </label>
          </div>
          <label className="form-control w-full">
            <span className="label-text text-xs font-semibold">Notes for buyers</span>
            <textarea
              className="textarea textarea-bordered textarea-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fresh harvest, good quality, need pickup..."
            />
          </label>
          <button className="btn btn-primary btn-sm" onClick={handlePublish}>
            Publish listing
          </button>
        </div>
      )}

      <div className="space-y-2">
        {listings.length === 0 ? (
          <p className="text-sm text-base-content/50 text-center">
            No harvest listed yet. Publish one above to connect with buyers directly.
          </p>
        ) : (
          listings.map((l) => (
            <div
              key={l.id}
              className={`card bg-base-100 border shadow-sm p-4 ${l.farmerId === farmerId ? "border-primary/40" : "border-base-content/10"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold text-neutral">{l.crop}</p>
                  <p className="text-sm text-base-content/70">
                    {l.quantity} {l.unit}
                    {l.askingPrice ? ` · ₹${l.askingPrice.toLocaleString("en-IN")}/${l.unit}` : ""}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {l.farmerName} · {l.farmerVillage}
                  </p>
                  {l.notes && (
                    <p className="text-xs text-base-content/60 mt-1">{l.notes}</p>
                  )}
                  <p className="text-xs text-base-content/40 mt-1">
                    {new Date(l.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                {l.farmerId === farmerId && (
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => handleRemove(l.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
