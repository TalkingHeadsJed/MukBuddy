# Muk Buddy — Product Requirements & State

## Original Problem Statement
Build a high-converting Bold DTC light-mode landing page for "Muk Buddy" — a patented 2-chamber reusable wet/dry vacuum filter/bag accessory (mukbuddy.com). Includes:
- Bold DTC light-mode design (slime green / purple / cream, mascot peeks)
- Secure lead form (rate-limited, honeypot, validated)
- Heavy SEO (sitemap, RSS, structured data)
- MySQL backend (SQLite locally; MySQL on Pair VPS)
- Resend email notifications to Jed@websitetalkingheads.com
- Static Markdown-based blog system (no live admin UI for security)
- Robust deploy scripts for Pair VPS / Apache reverse proxy
- Auto-deploy via GitHub webhook on push to main (web-guy added)

## Architecture
```
/app/
├── backend/          FastAPI + SQLAlchemy async (SQLite dev / MySQL prod) + Resend
├── content/blog/     Markdown source for blog posts
├── deploy/           VPS scripts: deploy-mukbuddy.sh, start-mukbuddy.sh,
│                     webhook-listener.py, run-mukbuddy-api.sh, supervisord/apache configs
├── frontend/         React 19 + Tailwind + Shadcn UI
│   ├── public/
│   │   ├── blog/         Generated static blog HTML (built by scripts/build-blog.js)
│   │   ├── sitemap.xml   Regenerated to include /blog/* URLs
│   │   └── feed.xml      RSS feed for blog
│   └── src/components/sections/  Landing sections incl. BlogStrip
├── scripts/
│   ├── build-blog.js   Static blog generator (marked + sanitize-html + gray-matter)
│   └── gen_bagless_image.py
└── DEPLOY-CHECKLIST.md  28-step VPS deploy guide
```

## Build pipeline
Frontend production build: `cd frontend && yarn build:blog`
(Compiles MD → static HTML in /frontend/public/blog/, regenerates sitemap.xml & feed.xml, then runs CRA build.)

## Key API endpoints
- `POST /api/leads` — Save lead + queue Resend email
- `GET /api/health` — Health probe

## DB schema (leads)
`id (UUID), name, email, phone, crew_size, message, created_at, notified, last_seen_at`

## 3rd-party integrations
- **Resend** — Lead notifications (key in `backend/.env`)
- **Vimeo** — Embedded hero video

## Implementation history
- **Phase 1 (initial fork):** Bold DTC light-mode design system, 15 landing sections, FastAPI + Mongo lead form
- **Phase 2:** Migrated backend Mongo → SQLAlchemy async (SQLite dev / MySQL prod), added Resend, /thank-you page
- **Phase 3:** Static Markdown blog system (build-blog.js + BlogStrip), VPS deploy suite
- **Phase 4 (web guy on GitHub):** host-side adaptations (deploy/start-mukbuddy.sh, deploy-mukbuddy.sh, webhook-listener.py for auto-deploy), backend/db.py tweaks
- **Phase 5 (2026-06-02 — current fork session):** Pulled web-guy's GitHub production code back into Emergent workspace, smart-merged blog system on top:
  - Cloned github.com/TalkingHeadsJed/MukBuddy → /app (preserved .env files)
  - Re-applied content/blog/, scripts/build-blog.js, BlogStrip.jsx, public/blog/, feed.xml
  - Merged package.json (added marked, sanitize-html, gray-matter + build:blog/blog:render scripts)
  - Injected <BlogStrip /> into Landing.jsx (between FinalCTA and Footer)
  - Added /#faq to sitemap base list
  - Smoke-tested: /api/health 200, /api/leads 201, /blog 200, /sitemap.xml 200, /feed.xml 200, BlogStrip renders

## Pending / Backlog
- **P1**: Verify web-guy completed VPS security remediation (move backend/ out of public_html, rotate Resend API key)
- **P2**: Write/publish real Muk Buddy blog posts (replace sample disposable-vs-reusable-shop-vac-bags.md)
- **P2**: Add Google Search Console verification token to frontend/public/index.html
- **P2**: Replace placeholder favicons in frontend/public/
- **P3**: Consider Cloudflare in front of Pair VPS for WAF/DDoS protection

## Critical agent notes for future sessions
- **Build command is `yarn build:blog`, NOT `yarn build`** — needed for blog HTML compilation
- Backend uses SQLite locally (dev_leads.db) and MySQL via DATABASE_URL on prod
- Emergent UI on user's account has only "Save to GitHub" (push) — no "Pull from GitHub" button. To pull from GitHub, use `git clone` via terminal.
- GitHub repo: `https://github.com/TalkingHeadsJed/MukBuddy` (public)
- Production deploy is auto-triggered by webhook-listener.py on push to main
