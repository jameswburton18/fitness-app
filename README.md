# Sturdy

A personal home strength & rehab app. One HTML file, no build step, no accounts, no equipment. All data stays on your phone in `localStorage`.

## The program

Built around WHO / ACSM physical-activity guidelines (strength for all major muscle groups 2+ days/week, 150+ min of moderate activity), arranged as a 7-day week of 25–30 minute sessions:

| Day | Session | Focus |
|-----|---------|-------|
| Mon | Lower Body — Knees | Knee ladder (wall sit → tempo squats → split squats → step-downs → RFESS → skater squat), glutes, calf & toe ladder, side planks |
| Tue | Upper Body + Core | Push & pull ladders, McGill Big 3 (curl-up, side plank, bird dog) |
| Wed | Yoga Flow | Hips, hamstrings, spine |
| Thu | Lower Body — Hinge & Hamstrings | Hinge patterning, eccentric slider curls, calf & toe ladder |
| Fri | Conditioning | Low-impact circuit, knee/toe-friendly |
| Sat | Long Stretch + Balance | Longer holds, single-leg balance (toe rehab) — or a brisk walk |
| Sun | Rest | — |

Rehab is baked in rather than bolted on:

- **Big toe strain** — toe mobility + short-foot drills in every lower warm-up; a calf/toe ladder that ends in pogo hops and strides as the return-to-sprint gate.
- **Knees** — isometrics first (wall sits), then progressive loading up the knee ladder.
- **Lumbar disc history** — McGill Big 3 as the core staple; hip-hinge patterning; no loaded spinal flexion.
- **Hamstring** — eccentric loading via slider curls (the home Nordic curl).

A pain traffic light (≤3/10 that settles by morning = fine; 4–5 = drop a rung; 6+/sharp = stop today) governs everything. Exercises live on progression "ladders"; after each session the app asks how the work felt and levels you up or down.

## Install on a phone (Pixel / Android)

1. Host the repo as a static site — GitHub Pages works out of the box:
   *Repo Settings → Pages → Source: **GitHub Actions*** (the included `pages.yml` workflow deploys on push).
2. Open the site in Chrome on the phone.
3. Tap **⋮ → Add to Home screen → Install**.

It then runs full-screen and offline like a native app.

## Files

- `index.html` — the entire app (UI, program data, workout player, progress tracking)
- `sw.js` — service worker for offline use
- `manifest.webmanifest`, `icon.svg` — PWA install metadata
- `.github/workflows/pages.yml` — GitHub Pages deploy
