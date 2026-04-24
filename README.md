# LingoFlow Pro

LingoFlow Pro is a web app for high-quality multilingual translation with automatic engine failover.

It is designed for professional use cases where translation reliability matters: if one provider fails due to quota, latency, or API errors, the app automatically retries with the next engine so users still get a result.

## What This App Does

- Translates text across 110+ languages
- Uses best-fit AI engines with fallback logic:
  - DeepL (primary for many European language pairs)
  - Groq / Llama 3 (fast support for many Asian, Indian, and Arabic use cases)
  - Gemini 1.5 Pro (universal fallback)
- Supports voice workflow:
  - Speech-to-text input (microphone)
  - Text-to-speech read aloud output
- Provides register presets:
  - Executive
  - Medical
  - Legal
  - Casual
- Stores recent translation history in the UI

## How It Works

```text
Browser UI (Next.js + Tailwind)
  -> POST /api/translate
     -> Engine router tries DeepL
     -> if unavailable/error, tries Groq
     -> if unavailable/error, tries Gemini
     -> returns translated text + engine metadata
```

### Reliability Model

LingoFlow Pro uses silent failover. Users do not need to manually switch providers when one service is down or rate-limited.

### Security Model

All API keys are read from server environment variables and are never exposed to the browser.

## Quick Start (Local)

### 1) Install

```bash
npm install
```

### 2) Configure environment variables

Create `.env` (or `.env.local`) with:

```env
DEEPL_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

You can run with a subset of keys. The router uses whichever engines are configured.

### 3) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy

This project is ready for Vercel deployment.

1. Import the GitHub repo in Vercel, or deploy with Vercel CLI
2. Add production environment variables:
   - `DEEPL_API_KEY`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
3. Deploy and share your `*.vercel.app` URL

## Register Presets

| Preset | Best for |
|---|---|
| Executive | Business and institutional communication |
| Medical | Clinical and scientific terminology |
| Legal | Contracts and compliance language |
| Casual | Everyday conversational translation |

## Notes

- AI output should still be reviewed for safety-critical domains (medical/legal).
- The app does not intentionally store user content in a database by default.
