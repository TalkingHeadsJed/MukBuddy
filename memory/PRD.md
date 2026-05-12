# Muk Buddy — Landing Page PRD

## Original Problem Statement
Build a high-converting, SEO-optimized landing page for **Muk Buddy** — a patented 2-chamber reusable wet/dry vac accessory (replaces disposable bags AND saves your motor from the "bagless tax"). Domain: mukbuddy.com. Tone: Bold DTC (Liquid Death / Dr. Squatch) — purple monster mascot, slime green, cream background. Secure lead form, FAQ, real jobsite proof, JSON-LD SEO.

## Stack
- Frontend: React 19 + Tailwind + Shadcn UI
- Backend: FastAPI + MongoDB (local) — Supabase migration BLOCKED on user credentials
- Image generation: Gemini Nano Banana (via EMERGENT_LLM_KEY)
- SEO: JSON-LD (Product, Organization, FAQPage, HowTo) in `index.html`

## Landing Page Section Order
1. Header
2. Hero (Vimeo modal)
3. **BagsVsMukBuddy** — "One Muk Buddy replaces 500+ disposable bags"
4. **Problem (The Bagless Lie)** — NEW (Feb 2026): "You thought going bagless was saving money. It's burning up your motor." With generated illustration of clogged filter + smoking motor. `$300+/yr filters`, `$200+ motor replacement` counters. CTA: "Save The Motor".
5. Money / Airflow / Difference / TwoChamber / Performance / Benefits / WasteScale / Proof / Objections / MoneyReminder / FAQ / LeadForm / FinalCTA / Footer
6. BleedTicker (sticky)

## CHANGELOG
- **Feb 2026 — Bagless Lie pivot**: Replaced original "Problem" section (which had Disposable Bags + Bag-less duality) with a single, sharper bagless-focused message. New AI-generated illustration at `/app/frontend/public/bagless-disaster.png` (Gemini Nano Banana). `Overline` export preserved for downstream sections.
- Earlier this session — generated `bagless-disaster.png` via `/app/scripts/gen_bagless_image.py` (one-shot Nano Banana script).
- `EMERGENT_LLM_KEY` added to `/app/backend/.env`.

## Backlog (P0 → P2)
- **P1**: Email notification on lead form submission (Resend integration suggested). Needs API key from user.
- **P1**: Supabase DB migration — BLOCKED on user's Supabase URL + `service_role` key.
- **P2**: AggregateRating JSON-LD schema for testimonial star-snippets in Google.

## Files of Note
- `/app/frontend/src/components/sections/Problem.jsx` — now the "Bagless Lie" section (keeps `Overline` export used by 10 other section files)
- `/app/frontend/src/components/sections/BagsVsMukBuddy.jsx` — intact
- `/app/frontend/src/lib/images.js` — `baglessDisaster: "/bagless-disaster.png"` added
- `/app/frontend/public/bagless-disaster.png` — generated illustration (clogged filter + smoking motor, no text, on-brand)
- `/app/scripts/gen_bagless_image.py` — Nano Banana one-shot for regenerating the image

## Brand Rules
- DO NOT replace user-provided contractor photos with stock.
- Maintain Bold DTC tone (Liquid Death / Dr. Squatch).
- Preserve all JSON-LD schemas in `index.html`.
