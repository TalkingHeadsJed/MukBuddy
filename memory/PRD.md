# Muk Buddy — Landing Page PRD

## Original Problem Statement
Build a high-quality landing page for **Muk Buddy** — the first real innovation
in wet/dry vacuums in 50 years. A patented 2-chamber design that separates
debris from airflow, maintains suction, protects motors, reduces filter wear,
and eliminates disposable bag costs. Domain: **mukbuddy.com**. Source product
page: https://thefloorlord.com/product/muk-buddy/

## User Choices
- Aesthetic: **Rugged industrial contractor / jobsite** feel
- Main video: Vimeo embed — https://vimeo.com/1183206006/8f6358ab2b
- Placeholder imagery OK for now
- CTAs link to thefloorlord.com product page (fulfillment)
- Tracking pixel slots present in `index.html` (to be filled in later)
- **Security-first** build (no open doors for attackers)
- Lead form for questions
- FAQ section

## Personas
- **Contractor owner / GC**: wants to equip crews, cares about $/year savings
  and fewer breakdowns
- **Foreman / crew lead**: needs the tool to work wet or dry, wants less
  downtime
- **Procurement / fleet buyer**: needs volume pricing, fit compatibility info

## Core Requirements (Static)
1. High-conversion landing page — hero, problem, science, benefits, ROI,
   testimonials, FAQ, contact, final CTA
2. Dual CTAs: "Order Muk Buddy Now" (external to thefloorlord.com) and
   "Watch The Video" (in-page Vimeo embed)
3. Lead capture form for presale questions
4. FAQ section (Shadcn accordion)
5. Tracking pixel slots (Meta, GA4, Google Ads, TikTok, LinkedIn)
6. Mobile-first responsive
7. Security: input validation, rate limiting, honeypot, strict CORS,
   security headers, disabled public API docs

## Architecture
- **Frontend**: React 19 + React Router + Tailwind + Shadcn UI. Anton / Manrope
  / JetBrains Mono fonts. Industrial brutalist theme (black background, safety
  yellow `#FACC15` accent, square corners, hazard stripes).
- **Backend**: FastAPI + Motor (MongoDB async). Single POST `/api/leads`
  endpoint with Pydantic validation, in-memory sliding-window rate limiter,
  honeypot field rejection, security-headers middleware, CORS middleware,
  `/docs` `/redoc` `/openapi.json` disabled.
- **DB**: MongoDB collection `leads` (id, name, email, phone, crew_size,
  message, created_at, meta{ip, user_agent}).

## What's Been Implemented (Dec 2025 — initial build)
- Landing page with 15 sections: Header, Hero (Vimeo play-on-click),
  Problem, Airflow, Difference, TwoChamber (flow diagram), Dry Performance,
  Wet Performance, Benefits grid, Money (yellow inverse ROI), Waste+Scale,
  Proof quotes, Objections, FAQ accordion, Lead Form, Final CTA, Footer
- Secure `/api/leads` endpoint + `/api/health`
- Tracking pixel slots in `/app/frontend/public/index.html` (commented)
- SEO meta + OG tags
- data-testid on all interactive elements
- Tests: 11/11 backend pytest + 25/25 frontend Playwright passing

## Backlog
### P0
- Add real tracking pixel snippets when user provides them
- Swap placeholder imagery for real product photography

### P1
- Volume pricing tier display (once pricing matrix is confirmed)
- Compatibility-check widget (user selects vac model → fit confirmation)
- Lead notification email integration (Resend or SendGrid) — requires API key

### P2
- Move in-memory rate limiter to Redis-backed (for multi-replica deploy)
- Admin dashboard to view captured leads (secured)
- Add customer logo strip (contractors using Muk Buddy)
- A/B test different hero headlines
- Spanish-language variant for bilingual crews

## Routes
- Frontend: `/` — Landing page (SPA)
- Backend:
  - `GET  /api/` — service ping
  - `GET  /api/health` — health check
  - `POST /api/leads` — create lead (validated, rate-limited, honeypot-protected)

## Security Posture
- Pydantic validation with max lengths + EmailStr + phone regex
- Honeypot hidden field rejects bots with 400
- Per-IP sliding window rate limiter (5 req / 60 sec) → 429
- Security headers middleware: X-Content-Type-Options, X-Frame-Options: DENY,
  Referrer-Policy, Permissions-Policy, HSTS
- FastAPI public docs disabled (`docs_url`/`redoc_url`/`openapi_url = None`)
- CORS methods restricted to `GET, POST, OPTIONS`
- No sensitive fields (meta.ip, meta.user_agent) returned in API response
- `_id` excluded / response model enforces shape

## Next Tasks
- Collect tracking pixel snippets from user → paste into `index.html` slots
- Decide on email notification provider (Resend recommended) and wire up
