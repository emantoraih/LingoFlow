'use client';

type Engine = 'DeepL' | 'Groq' | 'Gemini' | null;

interface Props {
  engine: Engine;
  processingTimeMs?: number;
  className?: string;
}

const ENGINE_STYLES: Record<NonNullable<Engine>, { label: string; bg: string; text: string; dot: string }> = {
  DeepL: {
    label: 'DeepL',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  Groq: {
    label: 'Groq · Llama 3',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
  },
  Gemini: {
    label: 'Gemini 1.5 Pro',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
};

export default function EngineStatusBadge({ engine, processingTimeMs, className = '' }: Props) {
  if (!engine) return null;
  const style = ENGINE_STYLES[engine];

  return (
    <div className={`flex items-center gap-2 badge-appear ${className}`}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
        {style.label}
      </span>
      {processingTimeMs !== undefined && (
        <span className="text-xs text-gray-400">{processingTimeMs}ms</span>
      )}
    </div>
  );
}
