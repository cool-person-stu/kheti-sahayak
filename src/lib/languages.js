export const LANGUAGES = [
  { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
  { code: "bn-IN", name: "Bengali", native: "বাংলা" },
  { code: "te-IN", name: "Telugu", native: "తెలుగు" },
  { code: "mr-IN", name: "Marathi", native: "मराठी" },
  { code: "ta-IN", name: "Tamil", native: "தமிழ்" },
  { code: "ur-IN", name: "Urdu", native: "اردو" },
  { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml-IN", name: "Malayalam", native: "മലയാളം" },
  { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as-IN", name: "Assamese", native: "অসমীয়া" },
  { code: "mai-IN", name: "Maithili", native: "मैथिली" },
  { code: "sat-IN", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "ks-IN", name: "Kashmiri", native: "कॉशुर" },
  { code: "ne-IN", name: "Nepali", native: "नेपाली" },
  { code: "sd-IN", name: "Sindhi", native: "सिन्धी" },
  { code: "doi-IN", name: "Dogri", native: "डोगरी" },
  { code: "kok-IN", name: "Konkani", native: "कोंकणी" },
  { code: "mni-IN", name: "Manipuri", native: "মৈতৈলোন্" },
  { code: "brx-IN", name: "Bodo", native: "बड़ो" },
  { code: "en-IN", name: "English", native: "English" },
]

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
}
