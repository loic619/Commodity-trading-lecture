# Lectures

Interactive lecture support web app hosting two university courses: **Commodity Trading** and **Tanker Chartering & Voyage Management**.

## Features

- Two course parts in one app, grouped in the module tab bar
- Guided section reader with keyboard navigation
- MCQ quizzes with immediate feedback
- Live calculators & simulators (hedging, basis, Worldscale, voyage estimating, draft & capacity…)
- No login: each module opens with its own invitation link (see `docs/invitations.md`)
- Dark theme, desktop-first, Vercel-deployed

## Courses & Modules

**Commodity Trading**: Panorama & Vocabulary · Operational Mechanics & Hedging · Strategies, Logistics, ESG & Data · Crude Oil: Market Analysis & Refining · Crude Oil: The Brent Complex & Hedging

**Tanker Chartering & Voyage Management**: Introduction — The Vessel, Worldscale & the Fixture · Pre-loading & Loading Operations · Laden Passage & Discharge Operations · Demurrage, the Time Charter & Disputes

Modules are addressed by slug (`/m/cherry`, `/m/fixture`, …), never by number:
a number on screen would tell a student that the modules before it exist. The
slug ↔ module map is in `src/lib/moduleSlugs.ts`.

## Tech Stack

Next.js 14 App Router · TypeScript · Tailwind CSS · Vercel

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

No env file is needed to run locally. Open an invitation link from
`docs/invitations.md` against http://localhost:3000 — for example
http://localhost:3000/m/cherry?k=q7mk2xr9vbt4ndshjw — and that module stays
open in this browser. http://localhost:3000 on its own shows what a student
without an invitation sees: nothing.

## Adding / Updating Content

Content files are in `src/content/`. Each module has its own folder.

To add a new topic to the panorama module:
1. Create `src/content/module-1/06-new-topic.ts`
2. Add it to `src/content/module-1/index.ts`
3. Push — Vercel redeploys in ~30 seconds

The `module-N` folder names are internal and never reach a URL or a screen.
Inside the prose, modules refer to each other by name ("the hedging module"),
never by number — `src/__tests__/content/noModuleNumbers.test.ts` enforces it.

## Deployment

The repository is connected to [Vercel](https://vercel.com)'s Git integration:
every push to `main` deploys production, every push to a branch builds a
preview. No GitHub Actions workflow and no repository secrets are involved.

No environment variable is required. To issue fresh invitation keys for a new
cohort, set `MODULE_<SLUG>_KEY` in the Vercel project settings — see
`docs/invitations.md`.

## Teacher-launched live simulators (optional)

The two timed simulators — the **Futures Screen** and the **PTBF floor** —
can be launched by the instructor for the whole class from a
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
