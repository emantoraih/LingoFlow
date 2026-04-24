import { GoogleGenerativeAI } from '@google/generative-ai';

const TONE_INSTRUCTIONS: Record<string, string> = {
  executive:
    'Use formal, executive-level professional language. Maintain proper institutional register and courtesy.',
  medical:
    'Use precise medical and clinical terminology. Preserve all drug names, anatomical terms, diagnostic labels, and clinical measurements exactly as written. Accuracy is critical for patient safety.',
  legal:
    'Use exact legal terminology and formal legal language. Preserve all legal citations, references, and technical terms. Avoid ambiguity.',
  casual:
    'Use natural, conversational, everyday language. Keep it friendly and accessible.',
};

export async function translateWithGemini(
  text: string,
  sourceLangName: string,
  targetLangName: string,
  tone: string
): Promise<{ translatedText: string }> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.executive;

  const fromClause =
    sourceLangName === 'Auto-Detect'
      ? 'Detect the source language automatically.'
      : `Source language: ${sourceLangName}.`;

  const prompt = `You are an expert multilingual translator.

Task: Translate the text below to ${targetLangName}.
${fromClause}
Tone/register: ${toneInstruction}

Critical rules:
- Return ONLY the translated text.
- Do not include explanations, preamble, or quotation marks.
- Do not add any commentary about the translation.
- Preserve all proper nouns, brand names, and technical terms.

Text to translate:
${text}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const translatedText = response.text().trim();

  return { translatedText };
}
