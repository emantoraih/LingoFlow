export type LanguageFamily = 'european' | 'asian' | 'indian' | 'arabic' | 'african' | 'other';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  family: LanguageFamily;
  deeplCode?: string; // DeepL-specific target code (e.g. "EN-US" not "en")
  deeplSupported: boolean;
  voiceLocale: string;
}

export const LANGUAGES: Language[] = [
  // EUROPEAN — DeepL primary
  { code: 'en', name: 'English', nativeName: 'English', family: 'european', deeplCode: 'EN-US', deeplSupported: true, voiceLocale: 'en-US' },
  { code: 'fr', name: 'French', nativeName: 'Français', family: 'european', deeplCode: 'FR', deeplSupported: true, voiceLocale: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', family: 'european', deeplCode: 'DE', deeplSupported: true, voiceLocale: 'de-DE' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', family: 'european', deeplCode: 'ES', deeplSupported: true, voiceLocale: 'es-ES' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', family: 'european', deeplCode: 'IT', deeplSupported: true, voiceLocale: 'it-IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', family: 'european', deeplCode: 'PT-PT', deeplSupported: true, voiceLocale: 'pt-PT' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', family: 'european', deeplCode: 'PT-BR', deeplSupported: true, voiceLocale: 'pt-BR' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', family: 'european', deeplCode: 'NL', deeplSupported: true, voiceLocale: 'nl-NL' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', family: 'european', deeplCode: 'PL', deeplSupported: true, voiceLocale: 'pl-PL' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', family: 'european', deeplCode: 'RU', deeplSupported: true, voiceLocale: 'ru-RU' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', family: 'european', deeplCode: 'UK', deeplSupported: true, voiceLocale: 'uk-UA' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', family: 'european', deeplCode: 'CS', deeplSupported: true, voiceLocale: 'cs-CZ' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', family: 'european', deeplCode: 'SK', deeplSupported: true, voiceLocale: 'sk-SK' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', family: 'european', deeplCode: 'RO', deeplSupported: true, voiceLocale: 'ro-RO' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', family: 'european', deeplCode: 'HU', deeplSupported: true, voiceLocale: 'hu-HU' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', family: 'european', deeplCode: 'BG', deeplSupported: true, voiceLocale: 'bg-BG' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', family: 'european', deeplCode: 'HR', deeplSupported: false, voiceLocale: 'hr-HR' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', family: 'european', deeplCode: 'DA', deeplSupported: true, voiceLocale: 'da-DK' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', family: 'european', deeplCode: 'FI', deeplSupported: true, voiceLocale: 'fi-FI' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', family: 'european', deeplCode: 'SV', deeplSupported: true, voiceLocale: 'sv-SE' },
  { code: 'nb', name: 'Norwegian', nativeName: 'Norsk', family: 'european', deeplCode: 'NB', deeplSupported: true, voiceLocale: 'nb-NO' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', family: 'european', deeplCode: 'EL', deeplSupported: true, voiceLocale: 'el-GR' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', family: 'european', deeplCode: 'LT', deeplSupported: true, voiceLocale: 'lt-LT' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', family: 'european', deeplCode: 'LV', deeplSupported: true, voiceLocale: 'lv-LV' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', family: 'european', deeplCode: 'ET', deeplSupported: true, voiceLocale: 'et-EE' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', family: 'european', deeplCode: 'SL', deeplSupported: true, voiceLocale: 'sl-SI' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', family: 'european', deeplCode: 'TR', deeplSupported: true, voiceLocale: 'tr-TR' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', family: 'european', deeplCode: 'IS', deeplSupported: true, voiceLocale: 'is-IS' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', family: 'european', deeplCode: 'MT', deeplSupported: true, voiceLocale: 'mt-MT' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', family: 'european', deeplCode: 'BS', deeplSupported: true, voiceLocale: 'bs-BA' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', family: 'european', deeplCode: 'SR', deeplSupported: true, voiceLocale: 'sr-RS' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', family: 'european', deeplSupported: false, voiceLocale: 'ca-ES' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', family: 'european', deeplSupported: false, voiceLocale: 'cy-GB' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', family: 'european', deeplSupported: false, voiceLocale: 'ga-IE' },

  // ASIAN / CJK — Groq primary for speed
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文(简体)', family: 'asian', deeplCode: 'ZH', deeplSupported: true, voiceLocale: 'zh-CN' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文(繁體)', family: 'asian', deeplCode: 'ZH', deeplSupported: true, voiceLocale: 'zh-TW' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', family: 'asian', deeplCode: 'JA', deeplSupported: true, voiceLocale: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', family: 'asian', deeplCode: 'KO', deeplSupported: true, voiceLocale: 'ko-KR' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', family: 'asian', deeplSupported: false, voiceLocale: 'th-TH' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', family: 'asian', deeplSupported: false, voiceLocale: 'vi-VN' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', family: 'asian', deeplCode: 'ID', deeplSupported: true, voiceLocale: 'id-ID' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', family: 'asian', deeplSupported: false, voiceLocale: 'ms-MY' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', family: 'asian', deeplSupported: false, voiceLocale: 'fil-PH' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', family: 'asian', deeplSupported: false, voiceLocale: 'km-KH' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', family: 'asian', deeplSupported: false, voiceLocale: 'my-MM' },

  // INDIAN — Groq primary
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', family: 'indian', deeplSupported: false, voiceLocale: 'hi-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', family: 'indian', deeplSupported: false, voiceLocale: 'bn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', family: 'indian', deeplSupported: false, voiceLocale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', family: 'indian', deeplSupported: false, voiceLocale: 'te-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', family: 'indian', deeplSupported: false, voiceLocale: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', family: 'indian', deeplSupported: false, voiceLocale: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', family: 'indian', deeplSupported: false, voiceLocale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', family: 'indian', deeplSupported: false, voiceLocale: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', family: 'indian', deeplSupported: false, voiceLocale: 'pa-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', family: 'indian', deeplSupported: false, voiceLocale: 'ne-NP' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', family: 'indian', deeplSupported: false, voiceLocale: 'si-LK' },

  // ARABIC & MIDDLE EASTERN — Groq primary
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', family: 'arabic', deeplCode: 'AR', deeplSupported: true, voiceLocale: 'ar-SA' },
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', family: 'arabic', deeplSupported: false, voiceLocale: 'fa-IR' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', family: 'arabic', deeplSupported: false, voiceLocale: 'he-IL' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', family: 'arabic', deeplSupported: false, voiceLocale: 'ur-PK' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', family: 'arabic', deeplSupported: false, voiceLocale: 'ku' },

  // AFRICAN
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', family: 'african', deeplSupported: false, voiceLocale: 'sw-KE' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', family: 'african', deeplSupported: false, voiceLocale: 'yo' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', family: 'african', deeplSupported: false, voiceLocale: 'ig' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', family: 'african', deeplSupported: false, voiceLocale: 'ha' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', family: 'african', deeplSupported: false, voiceLocale: 'am-ET' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', family: 'african', deeplSupported: false, voiceLocale: 'zu-ZA' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', family: 'african', deeplSupported: false, voiceLocale: 'af-ZA' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', family: 'african', deeplSupported: false, voiceLocale: 'so-SO' },

  // OTHER
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycanca', family: 'other', deeplSupported: false, voiceLocale: 'az-AZ' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', family: 'other', deeplSupported: false, voiceLocale: 'kk-KZ' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', family: 'other', deeplSupported: false, voiceLocale: 'hy-AM' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', family: 'other', deeplSupported: false, voiceLocale: 'ka-GE' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', family: 'other', deeplSupported: false, voiceLocale: 'mk-MK' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', family: 'other', deeplSupported: false, voiceLocale: 'sq-AL' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', family: 'other', deeplSupported: false, voiceLocale: 'eu-ES' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', family: 'other', deeplSupported: false, voiceLocale: 'gl-ES' },
];

export const AUTO_DETECT: Language = {
  code: 'auto', name: 'Auto-Detect', nativeName: 'Auto', family: 'other', deeplSupported: false, voiceLocale: '',
};

export const LANGUAGE_FAMILIES: Record<LanguageFamily, string> = {
  european: 'European',
  asian: 'Asian / CJK',
  indian: 'Indian Subcontinent',
  arabic: 'Arabic & Middle Eastern',
  african: 'African',
  other: 'Other',
};

export function getLangByCode(code: string): Language | undefined {
  return LANGUAGES.find(l => l.code === code);
}
