import { NextRequest, NextResponse } from 'next/server';
import { getLangByCode } from '@/lib/languages';
import { translateWithDeepL } from '@/lib/engines/deepl';
import { translateWithGroq } from '@/lib/engines/groq';
import { translateWithGemini } from '@/lib/engines/gemini';

export type EngineId = 'DeepL' | 'Groq' | 'Gemini';

export interface TranslateRequestBody {
  text: string;
  sourceLang: string; // e.g. "en", "auto"
  targetLang: string; // e.g. "fr"
  tone: string;       // "executive" | "medical" | "legal" | "casual"
}

export interface TranslateResponse {
  translatedText: string;
  engine: EngineId;
  detectedLanguage?: string;
  processingTimeMs: number;
}

/**
 * Determine the ordered list of engines to try based on target language family.
 * Priority:
 *   European languages → DeepL first (best accuracy), then Groq, then Gemini
 *   Asian / Indian / Arabic → Groq first (speed + multilingual), then Gemini, then DeepL
 *   Fallback → Gemini always last resort
 */
function getEngineOrder(targetFamily: string, targetDeeplSupported: boolean): EngineId[] {
  const hasDeepL = Boolean(process.env.DEEPL_API_KEY);
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  const order: EngineId[] = [];

  if (['asian', 'indian', 'arabic', 'african'].includes(targetFamily)) {
    // Speed-optimized for non-European
    if (hasGroq) order.push('Groq');
    if (hasGemini) order.push('Gemini');
    if (hasDeepL && targetDeeplSupported) order.push('DeepL');
  } else {
    // Quality-optimized for European
    if (hasDeepL && targetDeeplSupported) order.push('DeepL');
    if (hasGroq) order.push('Groq');
    if (hasGemini) order.push('Gemini');
  }

  return order;
}

export async function POST(req: NextRequest) {
  try {
    const body: TranslateRequestBody = await req.json();
    const { text, sourceLang, targetLang, tone } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }

    if (!targetLang) {
      return NextResponse.json({ error: 'Target language is required.' }, { status: 400 });
    }

    const targetLangObj = getLangByCode(targetLang);
    const sourceLangObj = sourceLang !== 'auto' ? getLangByCode(sourceLang) : null;

    if (!targetLangObj) {
      return NextResponse.json({ error: `Unknown target language: ${targetLang}` }, { status: 400 });
    }

    const engines = getEngineOrder(targetLangObj.family, targetLangObj.deeplSupported);

    if (engines.length === 0) {
      return NextResponse.json(
        { error: 'No translation engines are configured. Please add API keys to your environment.' },
        { status: 500 }
      );
    }

    let lastError: Error | null = null;

    for (const engine of engines) {
      try {
        const start = Date.now();
        let translatedText = '';
        let detectedLanguage: string | undefined;

        switch (engine) {
          case 'DeepL': {
            const deeplCode = targetLangObj.deeplCode!;
            const result = await translateWithDeepL(text, sourceLang, deeplCode, 'prefer_more');
            translatedText = result.translatedText;
            detectedLanguage = result.detectedLanguage;
            break;
          }
          case 'Groq': {
            const sourceName = sourceLangObj?.name ?? 'Auto-Detect';
            const result = await translateWithGroq(text, sourceName, targetLangObj.name, tone);
            translatedText = result.translatedText;
            break;
          }
          case 'Gemini': {
            const sourceName = sourceLangObj?.name ?? 'Auto-Detect';
            const result = await translateWithGemini(text, sourceName, targetLangObj.name, tone);
            translatedText = result.translatedText;
            break;
          }
        }

        const response: TranslateResponse = {
          translatedText,
          engine,
          detectedLanguage,
          processingTimeMs: Date.now() - start,
        };

        return NextResponse.json(response);

      } catch (err) {
        lastError = err as Error;
        console.warn(`[LingoFlow] Engine "${engine}" failed: ${lastError.message}. Failing over...`);
        // Silent failover — continue to next engine in the list
      }
    }

    // All engines exhausted
    console.error('[LingoFlow] All engines failed. Last error:', lastError?.message);
    return NextResponse.json(
      { error: `Translation failed. All engines exhausted. Last error: ${lastError?.message ?? 'Unknown error'}` },
      { status: 502 }
    );

  } catch (err) {
    console.error('[LingoFlow] Request parsing error:', err);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
