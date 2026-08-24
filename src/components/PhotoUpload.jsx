import { useState, useRef } from "react"
import { getPhotos, addPhoto, removePhoto } from "../lib/store"
import { useTranslation } from "../lib/useTranslation"

function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const scale = Math.min(1, maxWidth / img.width)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function PhotoUpload({ farmerId }) {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState(() => getPhotos(farmerId))
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const refresh = () => setPhotos(getPhotos(farmerId))

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await compressImage(file)
    setPreview(dataUrl)
  }

  const confirmUpload = () => {
    if (!preview) return
    addPhoto(farmerId, preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
    refresh()
  }

  const handleDelete = (photoId) => {
    removePhoto(farmerId, photoId)
    refresh()
  }

  return (
    <div className="space-y-4">
      <label
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-content/20 rounded-box cursor-pointer hover:border-primary/50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-base-content/40 mb-1" fill="currentColor" aria-hidden="true">
          <path d="M9 3 7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9Zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3Z" />
        </svg>
        <span className="text-sm text-base-content/60">{t("tapPhoto")}</span>
      </label>

      {preview && (
        <div className="card bg-base-200 p-3">
          <img src={preview} alt="Preview" className="rounded-box w-full max-h-64 object-cover" />
          <div className="flex gap-2 mt-3 justify-end">
            <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)}>
              {t("cancel")}
            </button>
            <button className="btn btn-primary btn-sm" onClick={confirmUpload}>
              {t("savePhoto")}
            </button>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.dataUrl}
                alt={t("harvestPhotos")}
                className="w-full h-32 object-cover rounded-box border border-base-content/10"
              />
              <span className="absolute bottom-1 left-1 badge badge-sm bg-base-100/80 text-xs">
                {new Date(photo.takenAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
              <button
                className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(photo.id)}
                aria-label={t("deletePhoto")}
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden="true">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !preview && (
        <p className="text-sm text-base-content/50 text-center">
          {t("noPhotos")}
        </p>
      )}
    </div>
  )
}
