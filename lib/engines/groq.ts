import Groq from 'groq-sdk';

const TONE_SYSTEM_PROMPTS: Record<string, string> = {
  executive:
    'You are an expert multilingual translator. Use formal, executive-level professional language. Maintain proper register, courtesy, and institutional tone throughout.',
  medical:
    'You are a certified medical translator with expertise in clinical and scientific terminology. Use precise, unambiguous medical language. Preserve all clinical terms, drug names, anatomical references, and diagnostic labels exactly. Accuracy is paramount — mistranslation can have patient safety consequences.',
  legal:
    'You are a certified legal translator. Use exact legal terminology and formal legal language consistent with the target jurisdiction. Preserve all legal references, citation formats, and technical terms. Avoid any ambiguity.',
  casual:
    'You are a friendly multilingual translator. Use natural, conversational language appropriate for everyday communication. Keep it clear, warm, and accessible.',
};

export async function translateWithGroq(
  text: string,
  sourceLangName: string,
  targetLangName: string,
  tone: string
): Promise<{ translatedText: string }> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const systemPrompt = TONE_SYSTEM_PROMPTS[tone] || TONE_SYSTEM_PROMPTS.executive;

  const userPrompt =
    sourceLangName === 'Auto-Detect'
      ? `Translate the following text to ${targetLangName}. Return ONLY the translated text — no preamble, no explanation, no quotation marks.\n\n${text}`
      : `Translate the following text from ${sourceLangName} to ${targetLangName}. Return ONLY the translated text — no preamble, no explanation, no quotation marks.\n\n${text}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2048,
  });

  const translatedText = response.choices[0]?.message?.content?.trim() ?? '';
  return { translatedText };
}
