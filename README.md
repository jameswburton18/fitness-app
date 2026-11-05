# Sturdy

A personal home strength & rehab app. One HTML file, no build step, no accounts, no equipment. All data stays on your phone in `localStorage`.

## The program

Version 3 (Oct 2026) rebuilds the knee work around the right patellar tendon (previously told it's damaged; it flares after single-leg squats but tolerates wall sits). It follows the patellar tendinopathy evidence: progressive loading (heavy slow resistance over eccentric-only), guided by a pain-monitoring model where up to 3/10 is fine if it's back to normal by the next morning. The big-toe (1st MTP) push-off ladder and the rest of the week are unchanged from version 2.

| Day | Session | Focus |
|-----|---------|-------|
| Mon | Rehab A: Knee & Hip | Wall sits, knee ladder, side-of-hip ladder, calf + big-toe ladders |
| Tue | Upper Body + Core | Push & pull ladders, McGill Big 3, wall-sit and toe top-up |
| Wed | Rehab B: Hinge & Knee | Hinge + hamstring ladders, knee, side-of-hip, calf + big toe |
| Thu | Yoga Flow | Knee-friendly versions (figure-4 instead of pigeon) |
| Fri | Rehab C: Knee & Toe | Wall sits, knee, glute, side-of-hip, big toe, calf, balance |
| Sat | Conditioning + Upper | 3 low-impact rounds using the push/pull rungs, or a long walk |
| Sun | Rest | — |

- **Knee ladder** has four stages for the tendon:
  1. Holds: split squat hold → Spanish squat hold (stand-in without the band: 90° wall sit).
  2. Slow two-leg reps (3s down, 3s up): high box squat → chair box squat → split squat → decline squat (slant board or heels on books) → Spanish squat (stand-in: loaded decline squat).
  3. Heavier and single-leg: step-down → single-leg decline squat, two-leg up → single-leg decline squat → RFESS → loaded single-leg decline squat → skater squat.
  4. Springy work: pogo hops, skipping and strides in the toe ladder, which won't level past rung 4 until the knee reaches the single-leg decline squat.
- **Next-morning knee check.** The knee ladder doesn't move on the post-session rating alone. The morning after a knee session, Today asks how the knee is compared with before it. Moving up needs "Easy" plus 2 settled mornings in a row (3 in stage 1). Still sore or worse drops a rung; worse also offers knee mode. A check missed for 3+ days lapses.
- **Big-toe push-off ladder** builds loaded toe extension: seated toe-bend raise → towel-roll heel raises → supported toe-tuck rocks → pogo → skipping → strides.
- **My kit** (loop bands, heavy band + door anchor, slant board, ankle weights, kettlebell) switches on exercises that need them. Rungs that need kit you haven't ticked use a kit-free stand-in.
- **Benchmarks** every 2 weeks: single-leg calf raises to fatigue (with metronome), toe-tuck kneel pain, step-down pain and knee drift, haunches pain.
- A pain traffic light (≤3/10 and settled by morning = fine; 4–5 = stay or drop a rung; 6+/sharp = stop today) governs everything. After each session the app asks how each ladder felt and levels you up or down.

- **Knee mode** for flare-ups (e.g. patellar-tendon pain just below the kneecap). Turn it on from Today (it's offered when the knee is logged at 3+/10) or the Library. It swaps the knee rung and squat-type drills for shallow isometric wall sits (5 × 45s), swaps quick step-ups for marching, pauses knee levelling, and adds a morning half-squat check. Three knee scores of ≤2 in a row end it automatically and restart the knee ladder one rung below where it was.

Existing data migrates automatically. Moving to v3 restarts the knee ladder at stage 1 and caps the toe ladder below pogo hops until the knee is ready.

## Looking ahead

- Today shows a **Tomorrow** line under the session. Tap it, or any day in the *This week* strip, to see that day's session with its contents open. *Back to today* (or tapping the day again) returns; *Do it today* starts it now.
- On the Plan tab, each day expands to show what's in it.
- Previews use your current rungs and kit, and knee mode if it's on.

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

## Stepwise (`mum/`)

A second app for Mum's knees, built on the same engine. It lives at `/mum/` on the same GitHub Pages site and installs as its own app.

- **Her knees:** both since Aug 2026. Left: mild early osteoarthritis on X-ray (small bony spur), started after a slide at tennis. Right: a knock on furniture. Pain mainly going downstairs, in low squats and after long sitting. No kneeling.
- **Week:** three ~30-minute strength days (Mon, Wed, Fri), two walk + stretch days, a stretch + balance day, a rest day.
- **Ladders:** knee (wall sit → slow box squats → split squat → step-downs, loaded), side of hip, glute bridge, hinge, calf, and Back to running (march → pogo hops → skipping → walk-jog), which waits until the knee reaches the loaded step-down.
- Keeps Sturdy's next-morning knee check, knee mode, pain traffic light, check-ins and fortnightly benchmarks (stairs, step-downs, 30s sit to stand, calf raises).
- Shares `figure.js` and `moves.js` with Sturdy; a few new exercise names reuse existing animations (aliases at the top of `mum/index.html`).
- Data is stored under `stepwise.*` in `localStorage` and each app's service worker only clears its own caches, so both can sit on one phone.
- Smoke test: `python3 dev/mumtest.py OUTDIR`.
