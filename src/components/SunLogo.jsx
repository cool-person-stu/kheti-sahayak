export default function SunLogo({ className = "w-16 h-16" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="44" r="26" fill="#F59E0B" />
      <path d="M20 72 H100 C88 84 72 88 60 88 C48 88 32 84 20 72 Z" fill="#4C9A2A" />
      <path d="M28 80 C40 70 52 74 60 66 C68 74 80 70 92 80 C80 92 68 96 60 96 C52 96 40 92 28 80 Z" fill="#3C7A1E" />
    </svg>
  )
}
