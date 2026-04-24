'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { LANGUAGES, AUTO_DETECT, LANGUAGE_FAMILIES, Language, LanguageFamily } from '@/lib/languages';

interface Props {
  value: string;
  onChange: (code: string) => void;
  includeAuto?: boolean;
  label?: string;
  disabled?: boolean;
}

export default function LanguageSelector({ value, onChange, includeAuto = false, label, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = value === 'auto'
    ? AUTO_DETECT
    : LANGUAGES.find(l => l.code === value) ?? LANGUAGES[0];

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = useCallback(() => {
    const q = search.toLowerCase();
    const pool = includeAuto ? [AUTO_DETECT, ...LANGUAGES] : LANGUAGES;
    if (!q) return pool;
    return pool.filter(
      l => l.name.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q) || l.code.toLowerCase().includes(q)
    );
  }, [search, includeAuto]);

  const grouped = useCallback(() => {
    const langs = filtered();
    if (search) return { 'Search Results': langs };
    const groups: Partial<Record<string, Language[]>> = {};
    if (includeAuto) groups['Auto'] = [AUTO_DETECT];
    for (const family of Object.keys(LANGUAGE_FAMILIES) as LanguageFamily[]) {
      const members = langs.filter(l => l.family === family);
      if (members.length > 0) groups[LANGUAGE_FAMILIES[family]] = members;
    }
    return groups;
  }, [filtered, search, includeAuto]);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="lang-select-container w-full">
      {label && <div className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wider">{label}</div>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-left transition-all
          ${open ? 'border-brunswick bg-white shadow-sm' : 'border-gray-300 bg-beige hover:border-brunswick-light'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          text-base font-medium text-gray-900`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="truncate">{selected.name}</span>
          {selected.nativeName !== selected.name && (
            <span className="text-gray-500 font-normal text-sm truncate hidden sm:inline">
              {selected.nativeName}
            </span>
          )}
        </span>
        <svg className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown">
          <div className="lang-dropdown-search">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search languages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          {Object.entries(grouped()).map(([group, langs]) => (
            <div key={group}>
              {group !== 'Auto' && (
                <div className="lang-group-header">{group}</div>
              )}
              {langs?.map(lang => (
                <div
                  key={lang.code}
                  className={`lang-option ${lang.code === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  <span className="text-sm font-medium text-gray-800">{lang.name}</span>
                  {lang.nativeName !== lang.name && (
                    <span className="text-xs text-gray-400">{lang.nativeName}</span>
                  )}
                  {lang.deeplSupported && (
                    <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">DeepL</span>
                  )}
                </div>
              ))}
            </div>
          ))}
          {filtered().length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-400 text-center">No languages found</div>
          )}
        </div>
      )}
    </div>
  );
}
