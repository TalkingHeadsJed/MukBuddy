# Muk Buddy — Product Requirements & State

## Original Problem Statement
Build a high-converting Bold DTC light-mode landing page for "Muk Buddy" — a patented 2-chamber reusable wet/dry vacuum filter/bag accessory (mukbuddy.com). Includes:
- Bold DTC light-mode design (slime green / purple / cream, mascot peeks)
- Secure lead form (rate-limited, honeypot, validated)
- Heavy SEO (sitemap, RSS, structured data)
- MySQL backend (SQLite locally; MySQL on Pair VPS)
- Resend email notifications to Jed@websitetalkingheads.com
- Static Markdown-based blog system (no live admin UI for security)
- Token-gated draft preview system (no live admin UI, no auth surface)
- Robust deploy scripts for Pair VPS / Apache reverse proxy
- Auto-deploy via GitHub webhook on push to main

## Architecture
```
/app/
├── backend/          FastAPI + SQLAlchemy async (SQLite dev / MySQL prod) + Resend
├── content/blog/     Markdown source for blog posts (published + drafts)
├── deploy/           VPS scripts: deploy-mukbuddy.sh, start-mukbuddy.sh,
│                     webhook-listener.py, run-mukbuddy-api.sh, supervisord/apache configs
├── frontend/         React 19 + Tailwind + Shadcn UI
│   ├── public/
│   │   ├── blog/
│   │   │   ├── <slug>/          Published static blog pages
│   │   │   ├── draft-preview/<TOKEN>/<slug>/   Token-gated drafts (gitignored)
│   │   │   ├── index.html       Public blog listing
│   │   │   └── posts.json       3 latest published, consumed by BlogStrip
│   │   ├── sitemap.xml   Regenerated to include /blog/* URLs
│   │   ├── feed.xml      RSS feed for published blog posts only
│   │   └── robots.txt    Disallows /blog/draft-preview/
│   └── src/components/sections/  Landing sections incl. BlogStrip
├── scripts/
│   ├── build-blog.js   Static blog generator (marked + sanitize-html + gray-matter)
│   │                   Reads BLOG_DRAFT_TOKEN from frontend/.env to gate drafts
│   └── gen_bagless_image.py
└── DEPLOY-CHECKLIST.md  28-step VPS deploy guide (Step 12 uses yarn build:blog)
```

## Build pipeline
Frontend production build: `cd frontend && yarn build:blog`
(Compiles MD → static HTML in /frontend/public/blog/, regenerates sitemap.xml & feed.xml, builds token-gated drafts if BLOG_DRAFT_TOKEN is set, then runs CRA build.)

## Key API endpoints
- `POST /api/leads` — Save lead + queue Resend email
- `GET /api/health` — Health probe

## DB schema (leads)
`id (UUID), name, email, phone, crew_size, message, created_at, notified, last_seen_at`

## Blog draft preview (token-gated)
- Drafts marked with `published: false` in frontmatter
- Rendered to `/blog/draft-preview/<BLOG_DRAFT_TOKEN>/<slug>/`
- Yellow banner, `<meta robots="noindex, nofollow">`, canonical points to future live URL
- Excluded from `posts.json`, `sitemap.xml`, `feed.xml`, public `/blog` index
- `/blog/draft-preview/` is `.gitignore`'d and disallowed in `robots.txt`
- Token rotation: change `BLOG_DRAFT_TOKEN` in `frontend/.env`, re-run `yarn build:blog`

## 3rd-party integrations
- **Resend** — Lead notifications (key in `backend/.env`)
- **Vimeo** — Embedded hero video

## Implementation history
- **Phase 1 (initial fork):** Bold DTC light-mode design system, 15 landing sections, FastAPI + Mongo lead form
- **Phase 2:** Migrated backend Mongo → SQLAlchemy async (SQLite dev / MySQL prod), added Resend, /thank-you page
- **Phase 3:** Static Markdown blog system (build-blog.js + BlogStrip), VPS deploy suite
- **Phase 4 (web guy on GitHub):** host-side adaptations (deploy/start-mukbuddy.sh, deploy-mukbuddy.sh, webhook-listener.py), backend/db.py tweaks
- **Phase 5 (2026-06-02, current session):**
  - Pulled web-guy's GitHub production code back into Emergent workspace via terminal git clone, smart-merged blog system on top
  - Built token-gated draft preview system: `/blog/draft-preview/<TOKEN>/<slug>/`, with banner, noindex, gitignored output, robots disallow, dotenv loader
  - Updated `deploy-mukbuddy.sh` and `DEPLOY-CHECKLIST.md` (Step 12) to use `yarn build:blog`
  - Smoke-tested 9 URLs end-to-end (200s across the board), draft URL renders banner + noindex confirmed

## Pending / Backlog
- **P0**: User to click "Save to GitHub" to push merged codebase + draft preview system to TalkingHeadsJed/MukBuddy
- **P1**: Verify web-guy completed VPS security remediation (move backend/ out of public_html, rotate Resend API key)
- **P1**: Generate fresh BLOG_DRAFT_TOKEN on the VPS (don't reuse the one in this chat)
- **P2**: Write/publish real Muk Buddy blog posts (replace sample published post + sample draft)
- **P2**: Add Google Search Console verification token to frontend/public/index.html
- **P2**: Replace placeholder favicons in frontend/public/
- **P3**: Consider Cloudflare in front of Pair VPS for WAF/DDoS protection

## Critical agent notes for future sessions
- **Build command is `yarn build:blog`, NOT `yarn build`** — needed for blog HTML compilation AND draft previews
- Backend uses SQLite locally (dev_leads.db) and MySQL via DATABASE_URL on prod
- Emergent UI on user's account has only "Save to GitHub" (push) — no "Pull from GitHub" button. To pull from GitHub, use `git clone` via terminal.
- GitHub repo: `https://github.com/TalkingHeadsJed/MukBuddy` (public)
- Production deploy is auto-triggered by webhook-listener.py on push to main
- `BLOG_DRAFT_TOKEN` is required in `frontend/.env` for draft previews to render. Build script has a built-in dotenv loader so it picks the var up automatically.
