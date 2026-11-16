# Module access — invitation links

Students no longer log in. There is no class password and no list of modules.
A module is reachable **only** by its own invitation link, and a student who
holds one cannot tell that any other module exists.

## The nine links

Send a student only the line(s) for the module(s) they should have. Prefix each
path with your deployment's origin (e.g. `https://lectures.example.com`).

### Commodity Trading

| Module | Link |
|---|---|
| Panorama & Vocabulary | `/m/cherry?k=q7mk2xr9vbt4ndshjw` |
| Operational Mechanics & Hedging | `/m/basis?k=z3pfc8wqmr6tkxnyva` |
| Strategies, Logistics, ESG & Data | `/m/atlas?k=h5bnw4rzqkd9mxtjcp` |
| Crude Oil: Market Analysis & Refining | `/m/barrel?k=v8txmq3jnrk7wbfdzs` |
| Crude Oil: The Brent Complex & Hedging | `/m/northsea?k=r4kzwnp6hxcmqtvbjg` |

### Chartering & Voyage

| Module | Link |
|---|---|
| Introduction — The Vessel, Worldscale & the Fixture | `/m/fixture?k=m9vqdhxk2wntrbzfcl` |
| Pre-loading & Loading Operations | `/m/manifold?k=c6jrnwzqmt8khpxvbd` |
| Laden Passage & Discharge Operations | `/m/passage?k=w2hmkxbnq5zrtjdvfc` |
| Demurrage, the Time Charter & Disputes | `/m/laytime?k=k8dzqvtmwnr3xhjbcp` |

## What a student experiences

1. They open the link. The middleware checks the key, drops a `m-<slug>`
   cookie (http-only, 180 days) and **redirects to the clean URL** — the key
   disappears from the address bar, so a screenshot or a shared history entry
   does not leak it.
2. From then on `/m/<slug>` just works on that device, for the term.
3. `/` sends them straight into their module if they hold exactly one, lists
   the ones they hold if several, and otherwise shows a neutral "use the link
   your instructor sent you" page that names nothing.
4. Guessing another slug (`/m/basis`) silently redirects to `/` — not a lock
   screen, because a lock screen would confirm that something is there.
5. Nothing on any page numbers a module. The tab bar appears only when a device
   holds two or more, and it lists exactly those.

## Rotating a key

Each module's key can be overridden by an environment variable, without
touching the code:

```
MODULE_CHERRY_KEY=…      MODULE_BARREL_KEY=…     MODULE_MANIFOLD_KEY=…
MODULE_BASIS_KEY=…       MODULE_NORTHSEA_KEY=…   MODULE_PASSAGE_KEY=…
MODULE_ATLAS_KEY=…       MODULE_FIXTURE_KEY=…    MODULE_LAYTIME_KEY=…
```

Set one in your host's environment settings and the old link stops working for
new visitors. Devices that already redeemed the old link keep their cookie
until it expires — to cut those off too, rename the cookie in
`moduleCookieName` (`src/lib/moduleAccess.ts`).

Set them for a new cohort each year; the defaults in the source are fine for a
single private deployment, less so once a link has circulated.

## Where this lives

| File | Role |
|---|---|
| `src/lib/moduleSlugs.ts` | slug ↔ internal id. No secrets — safe on the client |
| `src/lib/moduleAccess.ts` | the keys, the cookie name, `invitationPath()`. Server only |
| `src/middleware.ts` | the **only** place a key is redeemed (a Server Component cannot set a cookie) |
| `src/lib/unlocked.ts` | which modules this device holds |
| `src/lib/requireModuleAccess.ts` | the gate every `/m/[slug]` route passes through |
