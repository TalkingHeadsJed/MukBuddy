# Muk Buddy — Landing Page PRD

## Original Problem Statement
Build a high-quality landing page for **Muk Buddy** — the first real innovation
in wet/dry vacuums in 50 years. A patented 2-chamber design that separates
debris from airflow, maintains suction, protects motors, reduces filter wear,
and eliminates disposable bag costs. Domain: **mukbuddy.com**. Source product
page: https://thefloorlord.com/product/muk-buddy/

## Active Design Direction (as of Feb 2026 fork)
- Aesthetic: **Bold Consumer / DTC** — light cream background, sticker-style,
  playful chunky type, big monster mascot (Liquid Death × Dr. Squatch energy)
- Brand palette (from logo):
  - Cream `#FFF4D6` (page bg)
  - Slime green `#39FF14` (primary accent)
  - Muk purple `#7A6FE0` (secondary accent)
  - Deep ink `#1A0625` (text/borders)
- Typefaces:
  - `Nosifer` — drippy horror-movie title (matches logo)
  - `Bowlby One` / `Paytone One` — chunky H1/H2
  - `Bangers` — comic accent (buttons, ribbons)
  - `Nunito` — body
- Brand assets provided by user:
  - Logo PNG (monster + MUK BUDDY drippy text)
  - Text-only logo PNG
  - `.webm` product animation (dust flowing into 2-chamber)
  - `.mov` product demo video
- Previous "Rugged Industrial / Brutalism" design exists in git history if user
  wants to A/B or revert.

## Personas
- Contractor owner / GC — wants crew equipment, $/year savings, fewer breakdowns
- Foreman / crew lead — needs wet+dry performance, less downtime
- Procurement / fleet buyer — needs volume pricing + fit compatibility

## Core Requirements
1. High-conversion landing page — hero, problem, science, benefits, ROI,
   testimonials, objections, FAQ, contact, final CTA
2. Dual CTAs: "Feed The Monster" / "Grab One" / "Unleash Muk Buddy" all
   external to thefloorlord.com product page
3. Secure lead form (POST /api/leads) — honeypot + rate limiting + input
   validation (Pydantic v2). Real email provider integration pending.
4. FAQ accordion
5. Fully responsive (desktop + mobile with hamburger nav)

## Tech Stack
- Frontend: React 19 + Tailwind (custom DTC palette) + Shadcn UI primitives
- Backend: FastAPI + Motor (MongoDB async)
- DB: **MongoDB** currently. **Supabase migration PENDING** — user is
  collecting Transaction Pooler URI from their web guy. The integration
  playbook is saved — drop-in replacement via SQLAlchemy async + Alembic.

## Section Map (15 sections)
1. Header (sticky, mobile hamburger)
2. Hero (mascot logo + drippy title + dual CTA + product video modal)
3. Problem (disposable vs bag-less failure modes)
4. Airflow (5 failure points + slime banner)
5. Difference (intro to 2-chamber thesis)
6. TwoChamber (5-step walkthrough with product animation)
7. Performance — Dry (fine dust)
8. Performance — Wet (moisture)
9. Benefits (6-card grid)
10. Money (3 ROI blocks on dark ink)
11. WasteScale (before/after)
12. Proof (4 field testimonials)
13. Objections (4 myth/real responses)
14. FAQ (8-item accordion)
15. LeadForm (#contact)
16. FinalCTA (purple halftone + monster + "this isn't a bag, it's a fix")
17. Footer

## CHANGELOG
- **Feb 2026**: Pivoted design from "Rugged Industrial (dark)" to "Bold
  Consumer DTC (light cream)". Swapped palette, type stack, and core layout
  while preserving all 16 sections + data-testids + secure /api/leads flow.
  Added mobile hamburger nav. Wired user's logo + .webm + .mov brand assets.
  Frontend testing agent: 100% pass, no critical issues.
- **Previous fork**: Built initial "Rugged Industrial" variant (Black +
  Safety Yellow) with 11/11 backend + 25/25 frontend tests passing.

## Backlog / Upcoming
- **P0 — Waiting on user**: Supabase Transaction Pooler URI →  migrate
  /api/leads persistence. Playbook already fetched (SQLAlchemy async +
  Alembic, statement_cache_size=0, expire_on_commit=False).
- **P1**: Email notification on lead creation (Resend or SendGrid) so the
  user is pinged when a lead comes in.
- **P1**: Replace `twoChamberDiagram` placeholder image with real
  product/cutaway photo when user provides.
- **P2**: Product photography swap across all sections once user provides
  real product shots (currently using Unsplash/Pexels fallbacks).
- **P2**: Add tracking pixels (GA4, Meta Pixel) in `public/index.html` when
  user has pixel IDs.
- **P2**: Add `.mp4`/`.webm` fallback `<source>` for `productVideo` (.mov
  doesn't play in Firefox) — test agent suggestion.
- **P3**: A/B test hook-up (the user now has TWO design variants — rugged
  industrial and bold consumer — to A/B test with their client).
