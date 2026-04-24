import * as deepl from 'deepl-node';

export async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetDeeplCode: string,
  formality: 'more' | 'less' | 'prefer_more' | 'prefer_less' | 'default' = 'prefer_more'
): Promise<{ translatedText: string; detectedLanguage?: string }> {
  const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

  const sourceCode = sourceLang === 'auto'
    ? null
    : (sourceLang.toUpperCase() as deepl.SourceLanguageCode);

  const targetCode = targetDeeplCode as deepl.TargetLanguageCode;

  const options: deepl.TranslateTextOptions = {};
  // Formality only supported for certain languages — DeepL SDK handles the error
  if (formality !== 'default') {
    options.formality = formality as deepl.Formality;
  }

  const result = await translator.translateText(text, sourceCode, targetCode, options);
  const translated = Array.isArray(result) ? result[0] : result;

  return {
    translatedText: translated.text,
    detectedLanguage: translated.detectedSourceLang ?? undefined,
  };
}
