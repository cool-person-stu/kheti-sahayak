import { useState, useRef, useEffect } from "react"
import { useLanguage } from "../lib/LanguageContext"
import { useTranslation } from "../lib/useTranslation"
import { askAI, getAIKey } from "../lib/ai"
import { getSensorData, getMockSensorData, formatSensorForAI } from "../lib/soilSensor"
import { getEnvData } from "../lib/store"
import { getCropPricing } from "../lib/store"
import { fetchWeather, getApiKey as getWeatherKey } from "../lib/weather"
import { getLanguage } from "../lib/languages"
import VoiceInput from "./VoiceInput"
import SpeakerButton from "./SpeakerButton"

const GREETINGS = {
  "hi-IN": "नमस्ते! मैं आपका अन्नदाता एआई सहायक हूँ। मुझसे अपने खेत, फसल, मौसम या मिट्टी के बारे में कुछ भी पूछें।",
  "bn-IN": "নমস্কার! আমি আপনার অন্নদাতা এআই সহকারী। আমাকে আপনার খামার, ফসল, আবহাওয়া বা মাটি সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন।",
  "te-IN": "నమస్కారం! నేను మీ అన్నదాతా ఏఐ సహాయకుడను. మీ పొలం, పంట, వాతావరణం లేదా నేల గురించి నన్ను ఏదైనా అడగండి.",
  "ta-IN": "வணக்கம்! நான் உங்கள் அன்னதாதா ஏஐ உதவியாளர். உங்கள் பண்ணை, பயிர், வானிலை அல்லது மண் பற்றி என்னிடம் எதையும் கேளுங்கள்.",
  "mr-IN": "नमस्कार! मी तुमचा अन्नदाता एआई सहायक आहे. मला तुमच्या शेती, पिक, हवामान किंवा मातीबद्दल काहीही विचारा.",
  "gu-IN": "નમસ્તે! હું તમારો અન્નદાતા એઆઈ સહાયક છું. મને તમારા ખેતર, પાક, હવામાન અથવા માટી વિશે કંઈપણ પૂછો.",
  "kn-IN": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅನ್ನದಾತಾ ಎಐ ಸಹಾಯಕ. ನಿಮ್ಮ ಹೊಲ, ಬೆಳೆ, ಹವಾಮಾನ ಅಥವಾ ಮಣ್ಣಿನ ಬಗ್ಗೆ ನನ್ನನ್ನು ಏನನ್ನಾದರೂ ಕೇಳಿ.",
  "ml-IN": "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അന്നദാതാ എഐ സഹായകനാണ്. നിങ്ങളുടെ കൃഷി, വിള, കാലാവസ്ഥ അല്ലെങ്കിൽ മണ്ണ് സംബന്ധിച്ച് എന്നോട് എന്തും ചോദിക്കുക.",
  "pa-IN": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਅੰਨਦਾਤਾ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਮੈਨੂੰ ਆਪਣੇ ਖੇਤ, ਫ਼ਸਲ, ਮੌਸਮ ਜਾਂ ਮਿੱਟੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
  "or-IN": "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଅନ୍ନଦାତା ଏଆଇ ସହାୟକ। ମୋତେ ଆପଣଙ୍କ ଖେତ, ଫସଲ, ପାଣିପାଗ କିମ୍ବା ମାଟି ବିଷୟରେ ଯେକୌଣସି କଥା ପଚାରନ୍ତୁ।",
  "as-IN": "নমস্কাৰ! মই আপোনাৰ অন্নদাতা এআই সহায়ক। মোক আপোনাৰ খেতিয়, শস্য, বতৰা বা মাটিৰ বিষয়ে যিকোনো কিবা সোধক।",
  "ne-IN": "नमस्कार! म तपाईंको अन्नदाता एआई सहायक हुँ। मलाई तपाईंको खेत, बाली, मौसम वा माटोबारे केही सोध्नुहोस्।",
  "mai-IN": "नमस्कार! हम अहाँक अन्नदाता एआई सहायक छी। हमक अहाँक खेत, फसल, मौसम अथवा माटी के बारेमे कुछ भी पुछू।",
  "sat-IN": "ᱠᱤᱱᱚᱨᱚᱜ! ᱟᱤᱱᱟ ᱫᱷᱟᱨᱤᱭᱟᱜ ᱥᱟᱨᱤ ᱟᱨ ᱫᱟᱜᱚᱡᱚᱢᱚᱛᱚ ᱟᱨᱤ ᱨᱮᱭᱚᱵᱚᱜᱚᱱᱟ।",
  "ks-IN": "سلام! میں تھیہند龇 اَنّدادَتا اے آئی معاونٕ۔ مٮ۪چھِ اَمٮ۪تھ اندھٔر اَسٮ۪ جٔس، بُӜ، موسم یا دُViewInit مٮ۪چھ پُچھیو۔",
  "sd-IN": "سلام! مان تنھنجو اَنّدادَتا اے آئي معاون آهيان۔ مانھنھي اندھنجي کھيتر، پک، موسم يا ۾تي بابت ڪجهه به پڇهيو۔",
  "doi-IN": "नमस्कार! मैं तुहाड़ा अन्नदाता एआई सहायक हां। मैनूं तुहाड़े खेत, फसल, मौसम जां मिट्टी बारे कुझ वी पुछो।",
  "kok-IN": "नमस्कार! हांव तुमचो अन्नदाता एआई सहायक. म्हाका तुमच्या शेती, पिक, हवामान वा मातीबद्दल कितलेंय विचारा।",
  "mni-IN": "ꯈꯨꯝꯕꯤ! ꯑꯩ ꯑꯃꯅ ꯅꯥꯡꯗꯥꯠ꯭ꯠꯀꯤ ꯀꯩꯏ ꯃꯁꯤꯠꯇꯥꯟꯕꯤ। ꯑꯩꯅ ꯅꯥꯡ꯭ꯠꯕꯥꯡ, ꯃꯦꯠ, ꯍꯥꯕꯛꯀꯅꯤ ꯇꯥ ꯑꯩꯅ꯭ꯠꯌꯤ ꯇꯦꯡꯕꯤ।",
  "brx-IN": "नमस्कार! आं बोनाथराय एआई सहायक याव। बोनाथनाव नों थामानि सिंह, गाव, निआ जा मादा नि थायें जाय मिथिं बाइसें।",
  "en-IN": "Namaskar! I am your Annadata AI assistant. Ask me anything about your farm, crops, weather, or soil.",
}

const SUGGESTIONS = {
  "hi-IN": ["मुझे इस मौसम में कौन सी फसल बोनी चाहिए?", "मेरी मिट्टी कैसी है?", "मैं फसल कब काटूँ?"],
  "bn-IN": ["আমাকে এই মৌসুমে কোন ফসল লাগানো উচিত?", "আমার মাটি কেমন?", "আমি ফসল কখন কাটব?"],
  "te-IN": ["ఈ సీజన్లో నేను ఏ పంట నాటాలి?", "నా నేల ఎలా ఉంది?", "నేను పంటను ఎప్పుడు కోయాలి?"],
  "ta-IN": ["இந்த பருவத்தில் நான் எந்த பயிர் நட வேண்டும்?", "என் மண் எப்படி உள்ளது?", "பயிரை எப்போது அறுவடை செய்ய வேண்டும்?"],
  "mr-IN": ["मला या हंगामात कोणते पीक लावावे लागेल?", "माझी माती कशी आहे?", "मी पीक कधी कापणी करू?"],
  "gu-IN": ["મારે આ ઋતુમાં કયું પાક લગાવવો જોઈએ?", "મારી જમીન કેવી છે?", "હું પાક ક્યારે કાપું?"],
  "kn-IN": ["ನಾನು ಈ ಋತುವಿನಲ್ಲಿ ಯಾವ ಬೆಳೆ ಬೆಳೆಯಬೇಕು?", "ನನ್ನ ಮಣ್ಣು ಹೇಗಿದೆ?", "ನಾನು ಬೆಳೆಯನ್ನು ಯಾವಾಗ ಕೊಯ್ಲು ಮಾಡಬೇಕು?"],
  "ml-IN": ["ഈ സീസണിൽ എന്ത് വിള നടണം?", "എന്റെ മണ്ണ് എങ്ങനെയാണ്?", "വിള എപ്പോൾ കൊയ്യണം?"],
  "pa-IN": ["ਮੈਨੂੰ ਇਸ ਮੌਸਮ ਵਿੱਚ ਕਿਹੜੀ ਫ਼ਸਲ ਬੋਣੀ ਚਾਹੀਦੀ ਹੈ?", "ਮੇਰੀ ਮਿੱਟੀ ਕਿਹੋ ਜਿਹੀ ਹੈ?", "ਮੈਂ ਫ਼ਸਲ ਕਦੋਂ ਕੱਟਾਂ?"],
  "or-IN": ["ମୋତେ ଏହି ଋତୁରେ କେଉଁ ଫସଲ ଲଗାଇବା ଉଚିତ?", "ମୋ ମାଟି କିପରି ଅଛି?", "ମୁଁ ଫସଲ କେବେ ଅମଳ କରିବି?"],
  "as-IN": ["মোক এই মৌসুমত কোন শস্যৰ খেতি কৰিব লাগে?", "মোৰ মাটি কেনেকৈ আছে?", "মই শস্য কেতিয়া কাটো?"],
  "ne-IN": ["मलाई यो मौसममा कुन बाली रोप्नु पर्छ?", "मेरो माटो कस्तो छ?", "म बाली कहिले काट्नु?"],
  "mai-IN": ["हमक एहि मौसममे कुन फसल रोपू चाही?", "हमार माटी कस्तक अछि?", "हम फसल कब कापू?"],
  "sat-IN": ["ᱟᱞᱤᱱᱤ ᱨᱚᱢᱚᱡᱚᱢᱚᱛᱚ ᱠᱩᱱᱚᱨᱚᱜ ᱪᱚᱱᱚᱢᱚᱫᱚ?", "ᱟᱨᱚᱢᱚᱱᱚᱜ ᱨᱮ ᱟᱨᱚᱢᱚ ᱪᱚᱨᱚ?", "ᱟᱨᱚᱢᱚ ᱨᱚᱢᱚᱡᱚᱢᱚᱛᱚ ᱠᱩᱱᱚᱨᱚᱜᱚ?"],
  "ks-IN": ["مٮ۪نٛدھٔ اَسٮ۪ گَڑٮ۪ مٮ۪نٛدھٔ کِس کَس تٮ۪لیٖچھ آسیس؟", "مٮ۪نٛدھٔ دُViewInit کیہا آسی؟", "مٮ۪نٛدھٔ بُӜ کَس کٮ۪س آسی؟"],
  "sd-IN": ["مانھنھي هن موسم ۾ ڪھيٿ ڪيترو لڳائڻ گھجي؟", "مونجي ۾تي ڪيئي آهي؟", "مان پک ڪھڏي کٽان؟"],
  "doi-IN": ["मैनूं इस मौसम में कुझ फसल बोनी चाहीदी है?", "मेरी मिट्टी किहो जिही है?", "मैं फसल कदों काटां?"],
  "kok-IN": ["म्हाका या हंगामांत कोणतें पीक लावपाक लागता?", "म्हजो माती कशो आसा?", "मी पीक कधीं कापणी करू?"],
  "mni-IN": ["ꯑꯩꯅ ꯭ꯡꯕꯀꯤ ꯑꯩ ꯭ꯡꯕꯥꯡ ꯑꯃꯅ ꯭ꯡꯕꯥꯡ ꯀꯆꯏ ꯍꯦꯠꯁꯤ?", "ꯑꯩꯀꯤ ꯃꯦꯠ ꯀꯩꯏ ꯀꯥꯟꯕꯤ?", "ꯑꯩ ꯃꯦꯠ ꯑꯃꯅ ꯭ꯡꯕꯥꯡ ꯈꯪꯕꯤ?"],
  "brx-IN": ["आं नों थामानि नि गावाव कुन बाइसें?", "आं थामानि मादा गोनों याव?", "आं नों थामानि गावाव कुन काटें?"],
  "en-IN": ["What crop should I plant this season?", "How is my soil health?", "When should I harvest?"],
}

export default function AiChat({ farmer }) {
  const { lang } = useLanguage()
  const { t } = useTranslation()
  const langInfo = getLanguage(lang)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(`kh_ai_chat_${farmer.id}`)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const greeting = GREETINGS[lang] || GREETINGS["en-IN"]
  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS["en-IN"]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`kh_ai_chat_${farmer.id}`, JSON.stringify(messages))
    }
  }, [messages, farmer.id])

  const handleClearChat = () => {
    setMessages([])
    localStorage.removeItem(`kh_ai_chat_${farmer.id}`)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: question }])
    setLoading(true)

    const sensorData = formatSensorForAI(getSensorData() || getMockSensorData(), getEnvData(farmer.id))
    const pricing = getCropPricing(farmer.id)
    const pricingStr = pricing ? `${pricing.cropType} at ₹${pricing.estimatedValue || 0} for ${pricing.quantity} ${pricing.unit}` : ""

    let weatherData = null
    const wk = getWeatherKey()
    if (wk && farmer.location) {
      try { weatherData = await fetchWeather(farmer.location.lat, farmer.location.lng) } catch {}
    }

    let livePrices = ""
    if (farmer.location && farmer.crop) {
      try {
        const { findNearbyMandi } = await import("../lib/mandi")
        const { fetchNearbyMandiPrices, getLivePriceString } = await import("../lib/agmarknet")
        const nearby = findNearbyMandi(farmer.location.lat, farmer.location.lng, farmer.crop, 300)
        const live = await fetchNearbyMandiPrices({ nearbyMandis: nearby, crop: farmer.crop })
        livePrices = getLivePriceString(farmer.crop, live.prices || [])
      } catch {}
    }
    const contextPricing = livePrices || pricingStr

    const result = await askAI({
      question,
      farmerData: farmer,
      sensorData,
      weatherData,
      cropPricing: contextPricing,
      language: langInfo.name,
      chatHistory: messages,
    })

    const reply = result.error || result.text
    setMessages((prev) => [...prev, { role: "assistant", text: reply }])
    setLoading(false)
  }

  if (!getAIKey() || getAIKey() === "YOUR_GEMINI_API_KEY") {
    return (
      <div className="card bg-base-100 border border-base-content/10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <h3 className="font-display text-xl font-bold text-neutral mb-2">{t("aiSetupTitle")}</h3>
        <p className="text-sm text-base-content/60 mb-4">{t("aiSetupDesc")}</p>
        <p className="text-xs text-base-content/50">{t("aiSetupHint")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[60vh]">
      {messages.length > 0 && (
        <div className="flex justify-end px-4 pt-2">
          <button className="btn btn-xs btn-ghost text-base-content/50" onClick={handleClearChat}>
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            {t("clearChat")}
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <p className="font-display text-lg font-bold text-neutral">{greeting}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {suggestions.map((s) => (
                <button key={s} className="btn btn-sm btn-outline" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-box px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.role === "assistant" && (
                <div className="mt-2">
                  <SpeakerButton text={msg.text} label={t("readAloud")} className="text-xs" />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-base-200 rounded-box px-4 py-3">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-base-content/10 p-3">
        <div className="flex items-center gap-2">
          <VoiceInput onResult={(text) => setInput(text)} />
          <input
            className="input input-bordered flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("aiPlaceholder")}
            disabled={loading}
          />
          <button className="btn btn-primary btn-circle" onClick={handleSend} disabled={loading || !input.trim()}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
