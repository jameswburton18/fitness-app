# Sturdy

A personal home strength & rehab app. One HTML file, no build step, no accounts, no equipment. All data stays on your phone in `localStorage`.

## The program

Version 2 (Sep 2026) is rebuilt around a right-knee patellofemoral pain flare and a big-toe (1st MTP) push-off problem. It follows the JOSPT 2019 patellofemoral pain guideline and the BJSM 2024 best-practice guide: hip plus knee strengthening, about 3 times a week, for 6–12 weeks.

| Day | Session | Focus |
|-----|---------|-------|
| Mon | Rehab A: Knee & Hip | Wall sits, knee ladder, side-of-hip ladder, calf + big-toe ladders |
| Tue | Upper Body + Core | Push & pull ladders, McGill Big 3, wall-sit and toe top-up |
| Wed | Rehab B: Hinge & Knee | Hinge + hamstring ladders, knee, side-of-hip, calf + big toe |
| Thu | Yoga Flow | Knee-friendly versions (figure-4 instead of pigeon) |
| Fri | Rehab C: Knee & Toe | Wall sits, knee, glute, side-of-hip, big toe, calf, balance |
| Sat | Conditioning + Upper | 3 low-impact rounds using the push/pull rungs, or a long walk |
| Sun | Rest | — |

- **Knee ladder** is ordered by patellofemoral load (Song 2023): high box squat → step-up → chair box squat → split squat → step-down → RFESS → skater squat.
- **Big-toe push-off ladder** builds loaded toe extension: seated toe-bend raise → towel-roll heel raises → supported toe-tuck rocks → pogo → skipping → strides.
- **My kit** (loop bands, ankle weights, kettlebell) switches on exercises that need them.
- **Benchmarks** every 2 weeks: single-leg calf raises to fatigue (with metronome), toe-tuck kneel pain, step-down pain and knee drift, haunches pain.
- A pain traffic light (≤3/10 and settled by morning = fine; 4–5 = stay or drop a rung; 6+/sharp = stop today) governs everything. After each session the app asks how each ladder felt and levels you up or down.

Existing data migrates automatically: knee and calf rungs are remapped to the new ladders (knee capped at rung 3 while it's flaring).

## The workout player

- Every exercise has a looping animated demo that follows the move's tempo (e.g. "3s down") and mirrors for left/right sets. The demos are drawn by a small 3D pictogram engine (`figure.js`), with the poses in `moves.js`.
- Controls: back · one big contextual button (Done / Start now / Pause / Skip rest) · next. Tap the timer to pause.
- Timed holds get a 5-second "get ready" count unless they follow a rest. Rests preview the next exercise and have a +15s button.
- Sound button (top right) cycles voice + beeps → beeps only → muted.
- ✕ opens an end sheet: keep going, finish and log it, or discard.
- The Library and the "What's in it" list open a demo sheet for any exercise.

## Install on a phone (Pixel / Android)

1. Host the repo as a static site — GitHub Pages works out of the box:
   *Repo Settings → Pages → Source: **GitHub Actions*** (the included `pages.yml` workflow deploys on push).
2. Open the site in Chrome on the phone.
3. Tap **⋮ → Add to Home screen → Install**.

It then runs full-screen and offline like a native app.

## Files

- `index.html` — the app (UI, program data, workout player, progress tracking)
- `figure.js` — exercise-demo engine (tiny 3D rig with IK, rendered to SVG)
- `moves.js` — the animation for each exercise, keyed by exercise name
- `dev/` — authoring guide, contact-sheet renderer (`shoot.py`) and an end-to-end smoke test (`apptest.py`)
- `sw.js` — service worker for offline use
- `manifest.webmanifest`, `icon.svg` — PWA install metadata
- `.github/workflows/pages.yml` — GitHub Pages deploy
