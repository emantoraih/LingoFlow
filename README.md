# LingoFlow Pro

Executive-grade AI translation platform with triple-engine failover architecture.

**Engines:** DeepL (European languages) → Groq/Llama 3 (Asian/Indian/Arabic) → Gemini 1.5 Pro (fallback)  
**Languages:** 110+ supported  
**Features:** Voice input/output, register presets (Executive, Medical, Legal, Casual), translation history, auto-failover

---

## Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Open .env.local and add your API keys
```

Required keys:
- `DEEPL_API_KEY` — from https://www.deepl.com/pro-api
- `GROQ_API_KEY` — from https://console.groq.com
- `GEMINI_API_KEY` — from https://aistudio.google.com/app/apikey

The app works with any subset of keys — it uses whichever engines are configured and skips the rest.

### 3. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel (One-click share link)

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts, then add env vars in dashboard
```

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a new GitHub repo
2. Go to https://vercel.com/new → import repo
3. Add environment variables in Vercel project settings:
   - `DEEPL_API_KEY`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
4. Click Deploy → share the `*.vercel.app` URL

---

## Architecture

```
Browser (React + Tailwind)
  └─ POST /api/translate
       └─ Engine Router (lib/router logic in route.ts)
            ├─ DeepL SDK      (European languages, highest accuracy)
            ├─ Groq SDK       (Asian/Indian/Arabic, speed-optimized)
            └─ Gemini SDK     (Universal fallback)
```

**Silent failover:** If any engine returns an error (rate limit, quota, network), the API route automatically retries with the next engine — no user notification, no downtime.

**Security:** All API keys are server-side only (`process.env`). They are never exposed to the browser.

---

## Register Presets

| Preset | Use case | Prompt instruction |
|---|---|---|
| Executive | Business, academic communication | Formal institutional language |
| Medical | Clinical notes, research papers | Precise clinical/scientific terminology, safety-critical |
| Legal | Contracts, regulatory documents | Exact legal terminology, zero ambiguity |
| Casual | Everyday communication | Natural conversational language |

---

## Notes for Medical & Academic Use

- The **Medical** register uses enhanced prompting that explicitly flags drug names, anatomical terms, and diagnostic labels for preservation
- Always verify AI translations of clinical content before distribution
- API keys are server-side only — suitable for institutional deployment
- No user data is stored by the application itself (check individual engine privacy policies)
