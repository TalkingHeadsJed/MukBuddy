# Muk Buddy — Product Requirements & State

## Original Problem Statement
Build a high-converting Bold DTC light-mode landing page for "Muk Buddy" — a patented 2-chamber reusable wet/dry vacuum filter/bag accessory (mukbuddy.com). Includes:
- Bold DTC light-mode design (slime green / purple / cream, mascot peeks) at `/`
- Trade-pro Meta ads variant at `/ads` (no mascot, professional, 3-benefit focus)
- Secure lead form (rate-limited, honeypot, validated)
- Heavy SEO (sitemap, RSS, structured data)
- MySQL backend (SQLite locally; MySQL on Pair VPS)
- Resend email notifications to Jed@websitetalkingheads.com
- Static Markdown-based blog system (no live admin UI for security)
- Token-gated draft preview system (no live admin UI, no auth surface)
- Robust deploy scripts for Pair VPS / Apache reverse proxy
- Auto-deploy via GitHub webhook on push to main

## Routes
| Route | Purpose | Style | SEO |
|---|---|---|---|
| `/` | Main landing page | Bold DTC cartoon (Nosifer/Bowlby/Bangers fonts, slime green/purple/cream, mascot) | index, follow |
| `/ads` | Meta ads campaign landing page | Trade-pro (Inter, navy/slate + red accent, bare product, no mascot) | **noindex, nofollow** + canonical → `/` |
| `/blog` | Public blog listing (static HTML) | Cartoon-adjacent | index, follow |
| `/blog/<slug>/` | Static blog post | Cartoon-adjacent | index, follow |
| `/blog/draft-preview/<BLOG_DRAFT_TOKEN>/<slug>/` | Token-gated draft preview | Cartoon-adjacent w/ yellow banner | noindex + robots.txt disallow |
| `/thank-you` | Conversion-tracking post-submit page | Cartoon | noindex |

## Architecture
```
/app/
├── backend/          FastAPI + SQLAlchemy async (SQLite dev / MySQL prod) + Resend
├── content/blog/     Markdown source for blog posts (published + drafts)
├── deploy/           VPS scripts: deploy-mukbuddy.sh (uses yarn build:blog), start-mukbuddy.sh,
│                     webhook-listener.py, run-mukbuddy-api.sh, supervisord/apache configs
├── frontend/         React 19 + Tailwind + Shadcn UI
│   ├── public/
│   │   ├── blog/         Published + draft-preview HTML (drafts gitignored)
│   │   ├── sitemap.xml   Excludes drafts
│   │   ├── feed.xml      Published only
│   │   └── robots.txt    Disallows /blog/draft-preview/
│   └── src/
│       ├── App.js        Routes: /, /ads, /thank-you, * → Landing
│       ├── pages/
│       │   ├── Landing.jsx     Main cartoon landing
│       │   ├── AdsLanding.jsx  Trade-pro Meta ads LP
│       │   └── ThankYou.jsx
│       ├── components/sections/ Section components incl. BlogStrip, LeadForm
│       └── lib/          constants.js, images.js, utils.js
└── scripts/build-blog.js  Static blog generator with built-in dotenv loader
```

## Meta Ads LP (`/ads`) details
- **File:** `frontend/src/pages/AdsLanding.jsx`
- **Style:** Trade-pro — navy `slate-900` + red `red-600` accent, Inter sans-serif, sharp corners
- **Heading override:** Scoped CSS in `index.css` under `[data-testid="ads-landing"] h1..h4` forces Inter + lowercase (overrides global Bowlby/uppercase)
- **3 Benefits:** (1) Saves money on filters & bags · (2) Improves suction performance · (3) Supports motor life
- **CTAs:** Primary "Order Muk Buddy" → `thefloorlord.com/product/muk-buddy/` · Secondary "Get crew pricing" → scroll to lead form
- **Lead form:** 3 fields (name/email/phone) + honeypot, posts to `/api/leads` with hidden message `"Meta ad landing page lead — requested info."` for source tagging
- **Meta Pixel:** Placeholder at top of file (`META_PIXEL_ID = "YOUR_PIXEL_ID"`). Fires `PageView` on mount and `Lead` on form submit once real ID is set.
- **SEO:** `<meta robots="noindex, nofollow">` injected via useEffect + canonical to homepage so it doesn't cannibalize organic search

## Build pipeline
Frontend production build: `cd frontend && yarn build:blog`
(Compiles MD → static HTML in /frontend/public/blog/, regenerates sitemap.xml & feed.xml, builds token-gated drafts if BLOG_DRAFT_TOKEN is set, then runs CRA build.)

## Key API endpoints
- `POST /api/leads` — Save lead + queue Resend email
- `GET /api/health` — Health probe

## DB schema (leads)
`id (UUID), name, email, phone, crew_size, message, created_at, notified, last_seen_at`

## 3rd-party integrations
- **Resend** — Lead notifications (key in `backend/.env`)
- **Vimeo** — Embedded hero video (main `/` only; NOT on `/ads`)
- **Meta Pixel** — Placeholder ready on `/ads` for future activation

## Implementation history
- **Phase 1 (initial fork):** Bold DTC light-mode design system, 15 landing sections, FastAPI + Mongo lead form
- **Phase 2:** Migrated backend Mongo → SQLAlchemy async (SQLite dev / MySQL prod), added Resend, /thank-you page
- **Phase 3:** Static Markdown blog system (build-blog.js + BlogStrip), VPS deploy suite
- **Phase 4 (web guy on GitHub):** host-side adaptations (deploy/start-mukbuddy.sh, deploy-mukbuddy.sh, webhook-listener.py), backend/db.py tweaks
- **Phase 5 (2026-06-02 morning):** Pulled web-guy's GitHub code into Emergent, merged blog system back on top
- **Phase 6 (2026-06-02 midday):** Built token-gated draft preview system (`/blog/draft-preview/<TOKEN>/<slug>/`, banner, noindex, gitignored, robots disallow, dotenv loader); switched deploy script to `yarn build:blog`
- **Phase 7 (2026-06-02 afternoon):** Built Meta ads landing page at `/ads` — trade-pro style, Inter font, navy + red, 3 benefits, dual CTA (order + lead form), Meta Pixel placeholder, noindex; scoped heading-font CSS override so main `/` cartoon style stays intact

## Pending / Backlog
- **P0**: User to click "Save to GitHub" to push merged codebase + draft preview system + Meta ads LP to TalkingHeadsJed/MukBuddy
- **P0**: User to obtain Meta Pixel ID and replace `"YOUR_PIXEL_ID"` placeholder in `AdsLanding.jsx` (line ~21)
- **P1**: Verify web-guy completed VPS security remediation (move backend/ out of public_html, rotate Resend API key)
- **P1**: Generate fresh BLOG_DRAFT_TOKEN on the VPS (don't reuse the one in this chat)
- **P2**: Write/publish real Muk Buddy blog posts (replace sample published + sample draft)
- **P2**: Add Google Search Console verification token to frontend/public/index.html
- **P2**: Replace placeholder favicons in frontend/public/
- **P2**: A/B test alternate hero image on `/ads` (try `contractorBag` photo vs current product PNG)
- **P3**: Consider Cloudflare in front of Pair VPS for WAF/DDoS protection

## Critical agent notes for future sessions
- **Build command is `yarn build:blog`, NOT `yarn build`** — needed for blog HTML compilation AND draft previews
- Backend uses SQLite locally (dev_leads.db) and MySQL via DATABASE_URL on prod
- Emergent UI on user's account has only "Save to GitHub" (push) — no "Pull from GitHub" button. To pull from GitHub, use `git clone` via terminal.
- GitHub repo: `https://github.com/TalkingHeadsJed/MukBuddy` (public)
- Production deploy is auto-triggered by webhook-listener.py on push to main
- `BLOG_DRAFT_TOKEN` is required in `frontend/.env` for draft previews to render. Build script has a built-in dotenv loader so it picks the var up automatically.
- **Meta ads LP (`/ads`) uses Inter font** — global `h1..h4` Bowlby rule in `index.css` is scoped-overridden with `[data-testid="ads-landing"] h1..h4`. Don't remove the scoped rule.
