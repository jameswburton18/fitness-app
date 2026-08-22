# CueSight — pool shot picker

Take a photo of your pool table mid-game and CueSight tells you the best shot to
play, drawing the aiming lines directly onto your photo and onto a top-down
table diagram.

It's a single self-contained HTML file — no build, no server, no dependencies.
Open `index.html` in any browser (it's designed for a phone at the table) or
serve it from any static host.

## Install on your phone

CueSight deploys to GitHub Pages as an installable PWA (offline-capable, with
its own home-screen icon), sharing this repo's Pages site with the Sturdy
fitness app:

- **CueSight**: https://jameswburton18.github.io/fitness-app/cuesight/
- Sturdy stays at the site root: https://jameswburton18.github.io/fitness-app/

Open the URL on your phone, then use the browser menu → **Add to Home
screen** (Android/Chrome offers "Install app"). After the first visit it works
offline — handy in pool halls with bad signal.

One quirk of sharing the Pages site: a push to the Sturdy branch runs *that*
branch's deploy workflow, which publishes only Sturdy and drops `/cuesight/`.
If that happens, re-run the "Deploy to GitHub Pages (Sturdy + CueSight)"
workflow from the Actions tab — it composes both apps and is also triggered
by any push to this branch.

## How it works

1. **Photo** — take a photo with all six pockets in frame, or pick one from
   your library. There's a built-in demo rack if you just want to try it.
2. **Table** — tap the 4 corner pockets in order around the table. This
   calibrates a homography between the photo and the real table plane
   (pick your table size: English 6ft / bar 7ft / 8ft / 9ft). Drag markers to
   fine-tune with a magnifier loupe; a **Swap** button fixes the long-side
   guess if the side-pocket rings land on the wrong rails.
3. **Balls** — tap where each ball touches the felt (cue / yours / theirs /
   8-ball), or hit **Auto-detect** to find balls by color against the cloth
   and then just label yours. Tap a placed ball to re-type it, drag to nudge.
4. **Shots** — the engine evaluates every ball-to-pocket combination:
   - **ghost-ball aiming**: where the cue ball's centre must be at contact
   - cut-angle feasibility and pocket approach-angle acceptance
     (side pockets reject shallow approaches)
   - path obstruction checks for both the cue ball's and object ball's lines
   - one-rail **bank shots** via cushion mirroring (with ball-radius inset)
   - a difficulty score from cut angle x distances x pocket approach

   Ranked shot cards let you compare options; each renders on the photo
   (amber = object-ball path, dashed chalk-blue = cue ball to the ghost ball)
   and on the diagram, with plain-English aiming advice
   ("cut it 28° to the left — strike the right half, about 63% full").

If nothing pots, it says so and suggests playing safe.

## Notes & limitations

- Tap the **base** of each ball (where it meets the felt), not its top — the
  calibration maps the cloth plane.
- Assumes a level table and a centre-ball hit; no spin/throw modelling yet.
- Auto-detect is a color-blob heuristic — good light helps; you can always
  correct it by hand.
- Ideas for later: cue-ball position play (leave), kick shots when snookered,
  spin-adjusted aiming.

## Development

Everything lives in `index.html`. The shot engine and homography math are
exposed on `window.__cs` for testing; `git log` has the Playwright-driven
checks used during development.
