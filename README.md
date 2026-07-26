# Commodity Trading Lecture

Interactive lecture support web app for a commodity trading masterclass. Built for university students (Licence / M1 / M2 Spécialisé).

## Features

- 3 module tabs (Panorama, Operational Mechanics, Strategies & ESG)
- Guided section reader with keyboard navigation
- MCQ quizzes with immediate feedback
- Live calculators: hedging exposure, basis/differential
- Password-protected (single shared class password)
- Dark theme, desktop-first, Vercel-deployed

## Modules

| Module | Level | Topics |
|--------|-------|--------|
| 1 — Panorama & Vocabulary | Licence / M1 | Commodity types, trader archetypes, futures/swaps/EFP, market structure, S&D |
| 2 — Operational Mechanics & Hedging | M1 / M2 | Differential, exposure, hedging strategies, incoterms, shipping |
| 3 — Strategies, ESG & Data | M2 Spécialisé | Options, EUDR regulation, advanced S&D, data trading |

## Tech Stack

Next.js 14 App Router · TypeScript · Tailwind CSS · Vercel

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local
echo "CLASS_PASSWORD=your-password-here" > .env.local

# Start dev server
npm run dev
```

Open http://localhost:3000, enter your class password.

## Adding / Updating Content

Content files are in `src/content/`. Each module has its own folder.

To add a new topic to Module 1:
1. Create `src/content/module-1/06-new-topic.ts`
2. Add it to `src/content/module-1/index.ts`
3. Push — Vercel redeploys in ~30 seconds

## Deployment

1. Push repo to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variable: `CLASS_PASSWORD` = your chosen password
4. Deploy — done

## Teacher-launched live simulators (optional)

The two timed simulators — the **Module 1 Futures Screen** and the **Module 2
PTBF floor** — can be launched by the instructor for the whole class from a
single screen: click **📡 Launch for class** (visible only while you are in
**Edit mode**) and every student's screen goes live in sync, playing the exact
same deterministic tape. No student clicks anything. Click **■ End broadcast**
to stop.

This needs a tiny shared store to hold one timestamp per simulator. In Vercel:

1. Storage → create a **KV** (Upstash Redis) database and connect it to the
   project. Vercel auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
2. Redeploy.

If those env vars are absent the feature simply hides the launch button and the
simulators fall back to the local **▶ Live market** control — nothing breaks.

## Running Tests

```bash
npm test
```
