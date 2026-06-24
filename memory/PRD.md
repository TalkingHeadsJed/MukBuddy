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

The `build:blog` script runs FOUR steps in order:
1. **`bash ../scripts/sync-blog-from-github.sh`** — Pulls latest `/content/blog/*.md`
   from `TalkingHeadsJed/MukBuddy@main` via the public GitHub raw URLs (no auth).
   This is CRITICAL — see the "Blog editing workflow" section below.
2. `node ../scripts/build-blog.js` — Compiles MD → static HTML in `build/blog/`,
   regenerates `sitemap.xml` + `feed.xml`, optionally builds token-gated drafts.
3. `craco build` — Standard CRA production build.
4. `node ../scripts/prerender.js` — Puppeteer prerenders `/`, `/ads`, `/about`,
   `/thank-you` to static HTML so non-JS crawlers/scrapers see real content.

## ⚠️ Blog editing workflow (READ THIS — easy to break)

**The user edits blog `.md` files directly on the GitHub web UI** (typo fixes,
adding video embeds, etc.). Emergent's "Save to GitHub" does a `git push --force`
of `main`, which would normally wipe any edits made on GitHub between syncs.

**The fix is `scripts/sync-blog-from-github.sh`** which the build pipeline now
runs automatically before every build. It pulls the latest .md content from the
public repo's raw URLs and writes to `/app/content/blog/` so subsequent commits
include the GitHub-side edits. The force-push then preserves them.

**Rules for future agents:**
- NEVER edit `/content/blog/*.md` directly in this pod without first running
  `bash scripts/sync-blog-from-github.sh` — you may overwrite the user's
  GitHub edits.
- BEFORE committing anything, run that sync script (or run `yarn build:blog`
  which does it for you).
- If you're adding a NEW blog post, fine — create the .md in the pod, commit,
  push. The sync script handles it from there.
- The script uses unauthenticated GitHub API (60 req/hr public limit) — plenty.

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
- **Phase 8 (2026-06-12):** Removed "Made with Emergent" badge HTML + emergent-main.js script tag from `frontend/public/index.html`. Production bundle is now badge-free after next `yarn build:blog` + VPS deploy. (Badge still visible on Emergent preview URL because it's injected by the preview proxy — does NOT affect mukbuddy.com.)
- **Phase 9 (2026-06-12):** Installed Meta Pixel (ID `1536485121326286`) site-wide in `frontend/public/index.html`. Fires `PageView` on initial load for `/`, `/ads`, `/thank-you`, blog. Fires `Lead` conversion event at successful form submit in `LeadForm.jsx` (main site) and `AdsLanding.jsx` (Meta ads LP). `/thank-you` fires a SPA-route PageView (no Lead — already fired at submit, prevents double-counting). Removed old placeholder `META_PIXEL_ID` dynamic loader from `AdsLanding.jsx`.
- **Phase 11 (2026-06-22):** Prebuilt-deploy workflow (orphan `prebuilt-deploy` git branch carrying `mukbuddy-prebuilt-LATEST.tar.gz` + datestamped copy for Otto to pull). UTM `sessionStorage` persistence for WooCommerce checkout attribution. Puppeteer prerendering (`scripts/prerender.js`) for `/`, `/ads`, `/thank-you` so crawlers/social scrapers see real HTML. Per-route `<head>` via `react-helmet-async` + `PageHead.jsx`. `build:blog` script now does MD compile → CRA build → prerender. Honeypot field renamed `site_ref` → `mb_meta` to dodge browser autofill 400s.
- **Phase 12 (2026-06-23):** Self-hosted LCP image assets on Pair (no CDN dependency). 3 compressed PNGs moved into `frontend/public/img/` and served from `mukbuddy.com/img/`:
  - `hero-composite.png` (146KB, was 1.5MB)
  - `bag-pile-mountain.png` (216KB, was 1.6MB)
  - `angie-spokesperson.png` (105KB, was 2.8MB)
  - `og-image-home.png` (146KB at root, was 1.5MB) — social-share image
  - Total LCP image weight: **5.9MB → 613KB** (~10x reduction). Tarball now 2.4MB.

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

## 🚢 Deploy workflow (READ THIS BEFORE TOUCHING BUILD ARTIFACTS)

**Confirmed in the 2026-06-23 fork:** Emergent's "Save to GitHub" pushes **only `main`**. Orphan branches committed locally (e.g., `prebuilt-deploy`) **never make it to GitHub**. Do NOT create new orphan branches and assume they will sync — they won't.

**The deploy artifact lives on `main`:**
- `/mukbuddy-prebuilt-LATEST.tar.gz` (root) — the fully-prerendered static build, ~2.4 MB
- `/frontend/build/` — the extracted version of the same, tracked as a fallback for Otto

**When you make build-affecting changes:**
1. Edit source under `frontend/src/` as normal
2. Run `cd frontend && yarn build:blog` (compiles blog MD → static HTML, then CRA build, then `prerender.js` with Chromium for `/`, `/ads`, `/thank-you`)
3. From repo root: `tar -czf mukbuddy-prebuilt-LATEST.tar.gz -C frontend build` and **also** keep the extracted `frontend/build/` tree in place (committed)
4. `git add mukbuddy-prebuilt-LATEST.tar.gz frontend/build && git commit -m "..."` directly on `main`
5. Tell the user to click "Save to GitHub" — Otto pulls from `https://raw.githubusercontent.com/TalkingHeadsJed/MukBuddy/main/mukbuddy-prebuilt-LATEST.tar.gz`

**`.gitignore` rules to preserve:**
- `/app/.gitignore` and `/app/frontend/.gitignore` have had `**/*.tar.gz`, `**/*.tar`, `**/*.tgz`, and `/build` removed/commented. DO NOT re-add them — the deploy pipeline depends on the tarball + `frontend/build/` being trackable.

**DO NOT REBUILD ON PAIR:** Pair has no Chromium. The tarball ships already-prerendered HTML. Otto's deploy is `curl → tar → rsync`, nothing else. This is documented in `DEPLOY-PREBUILT.md` and the warning block at the top of any deploy README.

**Verification one-liner Otto runs before deploying any tarball:**
```sh
tar -xzOf mukbuddy-prebuilt-LATEST.tar.gz build/ads/index.html | grep -c "STOP"
# must be > 0 (real prerendered HTML); if 0, the build is broken
```
- `BLOG_DRAFT_TOKEN` is required in `frontend/.env` for draft previews to render. Build script has a built-in dotenv loader so it picks the var up automatically.
- **Meta ads LP (`/ads`) uses Inter font** — global `h1..h4` Bowlby rule in `index.css` is scoped-overridden with `[data-testid="ads-landing"] h1..h4`. Don't remove the scoped rule.
