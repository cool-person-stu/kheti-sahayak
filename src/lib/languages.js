export const LANGUAGES = [
  { code: "hi-IN", name: "Hindi", native: "हिन्दी", speechInput: true, speechOutput: true },
  { code: "bn-IN", name: "Bengali", native: "বাংলা", speechInput: true, speechOutput: true },
  { code: "te-IN", name: "Telugu", native: "తెలుగు", speechInput: true, speechOutput: true },
  { code: "mr-IN", name: "Marathi", native: "मराठी", speechInput: true, speechOutput: true },
  { code: "ta-IN", name: "Tamil", native: "தமிழ்", speechInput: true, speechOutput: true },
  { code: "ur-IN", name: "Urdu", native: "اردو", speechInput: true, speechOutput: true },
  { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી", speechInput: true, speechOutput: true },
  { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ", speechInput: true, speechOutput: true },
  { code: "ml-IN", name: "Malayalam", native: "മലയാളം", speechInput: true, speechOutput: true },
  { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ", speechInput: true, speechOutput: true },
  { code: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ", speechInput: false, speechOutput: true },
  { code: "as-IN", name: "Assamese", native: "অসমীয়া", speechInput: false, speechOutput: true },
  { code: "ne-IN", name: "Nepali", native: "नेपाली", speechInput: false, speechOutput: true },
  { code: "mai-IN", name: "Maithili", native: "मैथिली", speechInput: false, speechOutput: false },
  { code: "sat-IN", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ", speechInput: false, speechOutput: false },
  { code: "ks-IN", name: "Kashmiri", native: "कॉशुर", speechInput: false, speechOutput: false },
  { code: "sd-IN", name: "Sindhi", native: "सिन्धी", speechInput: false, speechOutput: false },
  { code: "doi-IN", name: "Dogri", native: "डोगरी", speechInput: false, speechOutput: false },
  { code: "kok-IN", name: "Konkani", native: "कोंकणी", speechInput: false, speechOutput: false },
  { code: "mni-IN", name: "Manipuri", native: "মৈতৈলোন্", speechInput: false, speechOutput: false },
  { code: "brx-IN", name: "Bodo", native: "बड़ो", speechInput: false, speechOutput: false },
  { code: "en-IN", name: "English", native: "English", speechInput: true, speechOutput: true },
]

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
}

export function isSpeechInputSupported(code) {
  const lang = getLanguage(code)
  return lang.speechInput
}

export function isSpeechOutputSupported(code) {
  const lang = getLanguage(code)
  return lang.speechOutput
}
