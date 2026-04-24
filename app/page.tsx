'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import EngineStatusBadge from '@/components/EngineStatusBadge';
import { getLangByCode } from '@/lib/languages';

type Tone = 'executive' | 'medical' | 'legal' | 'casual';
type Engine = 'DeepL' | 'Groq' | 'Gemini' | null;

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: { transcript: string };
}

interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface HistoryEntry {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  engine: Engine;
  tone: Tone;
  timestamp: Date;
}

const TONES: { id: Tone; label: string; description: string }[] = [
  { id: 'executive', label: 'Executive', description: 'Formal professional language' },
  { id: 'medical', label: 'Medical', description: 'Clinical & scientific precision' },
  { id: 'legal', label: 'Legal', description: 'Legal terminology & formality' },
  { id: 'casual', label: 'Casual', description: 'Natural conversational tone' },
];

const MAX_CHARS = 5000;

export default function HomePage() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [sourceText, setSourceText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState<Tone>('medical');
  const [isLoading, setIsLoading] = useState(false);
  const [engine, setEngine] = useState<Engine>(null);
  const [processingMs, setProcessingMs] = useState<number | undefined>();
  const [detectedLang, setDetectedLang] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-translate on text or language change (debounced)
  const triggerTranslate = useCallback((text: string, src: string, tgt: string, t: Tone) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setOutputText('');
      setEngine(null);
      setProcessingMs(undefined);
      setDetectedLang(undefined);
      setError(null);
      return;
    }
    debounceRef.current = setTimeout(() => doTranslate(text, src, tgt, t), 900);
  }, []);

  const doTranslate = async (text: string, src: string, tgt: string, t: Tone) => {
    if (!text.trim() || src === tgt) return;
    setIsLoading(true);
    setError(null);
    setEngine(null);
    setProcessingMs(undefined);
    setDetectedLang(undefined);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang: src, targetLang: tgt, tone: t }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Translation failed. Please try again.');
        setOutputText('');
        return;
      }

      setOutputText(data.translatedText);
      setEngine(data.engine);
      setProcessingMs(data.processingTimeMs);
      if (data.detectedLanguage) {
        setDetectedLang(data.detectedLanguage);
      }

      // Add to history
      setHistory(prev => [
        {
          sourceText: text,
          translatedText: data.translatedText,
          sourceLang: src,
          targetLang: tgt,
          engine: data.engine,
          tone: t,
          timestamp: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    } catch {
      setError('Network error. Please check your connection.');
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceChange = (text: string) => {
    if (text.length > MAX_CHARS) return;
    setSourceText(text);
    triggerTranslate(text, sourceLang, targetLang, tone);
  };

  const handleSourceLangChange = (code: string) => {
    setSourceLang(code);
    triggerTranslate(sourceText, code, targetLang, tone);
  };

  const handleTargetLangChange = (code: string) => {
    setTargetLang(code);
    triggerTranslate(sourceText, sourceLang, code, tone);
  };

  const handleToneChange = (t: Tone) => {
    setTone(t);
    if (sourceText.trim()) triggerTranslate(sourceText, sourceLang, targetLang, t);
  };

  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const newSrc = targetLang;
    const newTgt = sourceLang;
    const newText = outputText || sourceText;
    setSourceLang(newSrc);
    setTargetLang(newTgt);
    setSourceText(newText);
    setOutputText('');
    setEngine(null);
    setDetectedLang(undefined);
    triggerTranslate(newText, newSrc, newTgt, tone);
  };

  const handleManualTranslate = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doTranslate(sourceText, sourceLang, targetLang, tone);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy'), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setOutputText('');
    setEngine(null);
    setProcessingMs(undefined);
    setDetectedLang(undefined);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    textareaRef.current?.focus();
  };

  const handleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition: SpeechRecognitionLike = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    const srcLangObj = getLangByCode(sourceLang);
    recognition.lang = srcLangObj?.voiceLocale ?? 'en-US';

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (e: SpeechRecognitionEventLike) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) {
        setSourceText(final);
        triggerTranslate(final, sourceLang, targetLang, tone);
      }
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!outputText) return;

    const tgtLangObj = getLangByCode(targetLang);
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.lang = tgtLangObj?.voiceLocale ?? 'en-US';

    // Tune speech defaults for cleaner output and less metallic/echo sound.
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const normalizedLang = utterance.lang.toLowerCase();
    const primaryLang = normalizedLang.split('-')[0];
    const preferredVoices = voices
      .filter(v => {
        const voiceLang = v.lang.toLowerCase();
        return voiceLang === normalizedLang || voiceLang.startsWith(`${primaryLang}-`) || voiceLang === primaryLang;
      })
      .sort((a, b) => {
        const score = (voice: SpeechSynthesisVoice) => {
          const name = voice.name.toLowerCase();
          let value = 0;
          // Prefer local voices to avoid network synthesis artifacts.
          if (voice.localService) value += 40;
          // Prioritize higher quality voice families commonly available.
          if (name.includes('neural') || name.includes('premium') || name.includes('enhanced')) value += 30;
          if (name.includes('google') || name.includes('samantha') || name.includes('microsoft')) value += 20;
          // De-prioritize novelty voices which can sound distorted.
          if (name.includes('novelty') || name.includes('whisper') || name.includes('robot')) value -= 50;
          return value;
        };
        return score(b) - score(a);
      });

    if (preferredVoices[0]) {
      utterance.voice = preferredVoices[0];
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Cancel any queued/overlapping utterances before speaking.
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Load voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined') window.speechSynthesis.getVoices();
  }, []);

  const detectedLangName = detectedLang ? getLangByCode(detectedLang.toLowerCase())?.name ?? detectedLang : undefined;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--beige)' }}>
      {/* Header */}
      <header style={{ background: 'var(--brunswick)' }} className="px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-white text-2xl font-semibold tracking-wide">LingoFlow Pro</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>Triple-Engine · 110+ Languages · Voice I/O</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {engine && (
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.76)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Active: {engine}
            </div>
          )}
          <button
            onClick={() => setShowHistory(h => !h)}
            className="text-sm px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
          >
            History {history.length > 0 && `(${history.length})`}
          </button>
        </div>
      </header>

      {/* Tone Selector */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0">Register:</span>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button
              key={t.id}
              onClick={() => handleToneChange(t.id)}
              title={t.description}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${tone === t.id
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-gray-300 text-gray-600 bg-white hover:border-brunswick-light hover:text-brunswick'
                }`}
              style={tone === t.id ? { background: 'var(--brunswick)' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language bar */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <LanguageSelector
            value={sourceLang}
            onChange={handleSourceLangChange}
            includeAuto
            label="Source"
          />
        </div>

        <button
          onClick={handleSwap}
          disabled={sourceLang === 'auto' || isLoading}
          title="Swap languages"
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 disabled:opacity-40 hover:opacity-90 transition-all active:scale-95 mt-5"
          style={{ background: 'var(--brunswick)' }}
        >
          ⇄
        </button>

        <div className="flex-1 min-w-0">
          <LanguageSelector
            value={targetLang}
            onChange={handleTargetLangChange}
            label="Target"
          />
        </div>
      </div>

      {/* Main panes */}
      <div className="flex-1 px-4 pb-4 flex flex-col sm:flex-row gap-3 min-h-0">
        {/* Source pane */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Source text</span>
            {detectedLangName && sourceLang === 'auto' && (
              <span className="text-sm px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                Detected: {detectedLangName}
              </span>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={sourceText}
            onChange={e => handleSourceChange(e.target.value)}
            placeholder="Type, paste, or speak your text here..."
            className="flex-1 w-full p-4 text-base text-gray-900 resize-none outline-none bg-white leading-relaxed"
            style={{ minHeight: '200px' }}
          />

          <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMic}
                title={isRecording ? 'Stop recording' : 'Voice input'}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all
                  ${isRecording
                    ? 'bg-red-500 text-white mic-pulse'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-brunswick hover:text-brunswick'
                  }`}
              >
                {isRecording ? '⏹' : '🎙️'}
              </button>
              <button
                onClick={handleClear}
                title="Clear"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-base bg-white border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-all"
              >
                ✕
              </button>
            </div>
            <span className={`text-sm ${sourceText.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
              {sourceText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Target pane */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Translation</span>
            <EngineStatusBadge engine={engine} processingTimeMs={processingMs} />
          </div>

          <div className="flex-1 p-4 overflow-y-auto" style={{ minHeight: '200px' }}>
            {isLoading ? (
              <div className="space-y-3 pt-1">
                <div className="skeleton h-4 w-11/12" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ) : error ? (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-400 text-lg">⚠</span>
                <p className="text-base text-red-700">{error}</p>
              </div>
            ) : outputText ? (
              <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">{outputText}</p>
            ) : (
              <p className="text-base text-gray-500 italic">Translation will appear here...</p>
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                disabled={!outputText || isLoading}
                title={isSpeaking ? 'Stop' : 'Read aloud'}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all disabled:opacity-30
                  ${isSpeaking
                    ? 'text-white'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-brunswick hover:text-brunswick'
                  }`}
                style={isSpeaking ? { background: 'var(--brunswick)' } : {}}
              >
                {isSpeaking ? (
                  <span className="flex items-end gap-0.5 h-5 pb-0.5">
                    <span className="wave-bar" style={{ height: '8px' }} />
                    <span className="wave-bar" style={{ height: '8px' }} />
                    <span className="wave-bar" style={{ height: '8px' }} />
                  </span>
                ) : '🔊'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputText || isLoading}
                title="Copy translation"
                className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brunswick hover:text-brunswick transition-all disabled:opacity-30"
              >
                {copyLabel}
              </button>
              <button
                onClick={handleManualTranslate}
                disabled={!sourceText.trim() || isLoading}
                className="text-sm px-3 py-2 rounded-lg text-white disabled:opacity-40 transition-all hover:opacity-90 font-medium"
                style={{ background: 'var(--brunswick)' }}
              >
                {isLoading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History drawer */}
      {showHistory && history.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Recent Translations ({history.length})
              </span>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
              {history.map((entry, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSourceText(entry.sourceText);
                    setSourceLang(entry.sourceLang);
                    setTargetLang(entry.targetLang);
                    setOutputText(entry.translatedText);
                    setEngine(entry.engine);
                    setTone(entry.tone);
                    setShowHistory(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">{entry.sourceText}</p>
                  </div>
                  <span className="text-gray-300 text-xs">→</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{entry.translatedText}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {entry.engine && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                        ${entry.engine === 'DeepL' ? 'bg-blue-50 text-blue-600' : ''}
                        ${entry.engine === 'Groq' ? 'bg-orange-50 text-orange-600' : ''}
                        ${entry.engine === 'Gemini' ? 'bg-purple-50 text-purple-600' : ''}
                      `}>{entry.engine}</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 py-3 text-center">
        <p className="text-sm text-gray-500">
          LingoFlow Pro · Triple-Engine Failover: DeepL → Groq → Gemini · All API calls are server-side only
        </p>
      </footer>
    </div>
  );
}
