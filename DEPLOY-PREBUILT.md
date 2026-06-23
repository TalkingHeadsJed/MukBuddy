# Muk Buddy — Prebuilt Deploy Package

> ## ⛔ DO NOT REBUILD ON PAIR
>
> **This tarball is already fully built and prerendered.** Pair only needs to
> *extract* it — no `yarn`, no `npm`, no `node`, no Chromium required.
>
> If you run `yarn build` or `yarn build:blog` on Pair, the prerender step
> will fail (Chromium isn't installed there) and you'll overwrite the good
> prerendered HTML with empty React SPA shells. The crawler-visible content
> (`<h1>`, per-route titles, OG tags, canonical URLs) will all disappear.
>
> **Just extract and rsync — that's the entire deploy.** See "How Otto deploys
> this on Pair" below.
>
> ### How to verify the tarball is properly prerendered
> ```sh
> tar -xzOf mukbuddy-prebuilt-LATEST.tar.gz build/ads/index.html | grep -c "STOP"
> # Should print a number > 0. If it prints 0, the build is broken — do not deploy.
> ```

Generated automatically by Emergent. The `build/` tree below is the
**complete static site** — every page fully prerendered with real
`<h1>`, per-route head tags, and the 7 published blog posts. Nothing
in here requires a build step on the destination server.

## What's inside

```
build/
├── index.html                  # / (prerendered, real <h1> + helmet meta)
├── ads/index.html              # /ads (Meta-ads landing page, noindex)
├── thank-you/index.html        # /thank-you (post-form, noindex)
├── blog/
│   ├── index.html              # /blog/ listing page
│   ├── <slug>/index.html       # each post — 7 currently published
│   ├── draft-preview/...       # token-gated draft previews
│   └── posts.json              # API-style index of all posts
├── sitemap.xml                 # SEO sitemap (includes all blog URLs)
├── feed.xml                    # RSS feed
├── robots.txt
├── og-image-home.png           # self-hosted social-share image
├── static/                     # CRA hashed JS/CSS bundles
└── ... other static assets
```

## How Otto deploys this on Pair (FreeBSD shared hosting)

1. **Extract:** untar this into a staging dir on Pair
   ```sh
   tar -xzf mukbuddy-prebuilt-<DATE>.tar.gz -C /tmp/mukbuddy-deploy
   ```
2. **Mirror to docroot:** rsync the contents into Apache's docroot
   ```sh
   rsync -av --delete /tmp/mukbuddy-deploy/ ~/public_html/
   ```
   (use `--delete` for a clean swap; omit it if you want additive updates)
3. **Apache:** no config change needed — the existing vhost serves these
   static files. SPA routing was previously needed because of the empty
   `#root` shell; with prerendered `index.html` / `ads/` / `thank-you/`
   each path is now a real HTML file. SPA fallback for unknown URLs is
   no longer required for SEO.

## Routine blog-only deploys (no Emergent needed)

When you only need to ship a new blog post and *no* React/homepage
code has changed:

1. On Pair (or anywhere Node is available), run:
   ```sh
   cd /path/to/mukbuddy-repo
   BLOG_OUTPUT_DIR=~/public_html node scripts/build-blog.js
   ```
   This regenerates **only**:
   - `~/public_html/blog/**/*.html`
   - `~/public_html/blog/posts.json`
   - `~/public_html/blog/draft-preview/...`
   - `~/public_html/sitemap.xml`
   - `~/public_html/feed.xml`

   It does **NOT** touch:
   - `~/public_html/index.html`
   - `~/public_html/ads/index.html`
   - `~/public_html/thank-you/index.html`
   - any other top-level file

2. Pure Node script — **no Chromium, no React build, no Pair install
   needed**. Safe to run as often as you publish.

For app/homepage changes you still need to ask Emergent for a fresh
prebuilt tarball (Chromium-based prerender can't run on Pair).

## Verification commands

After deploy, run these against the live site to confirm SEO is right:

```sh
# Each route must return a real <h1> (not the empty SPA shell):
curl -s https://mukbuddy.com/ | grep -oE '<h1[^>]*>[^<]{0,80}' | head -1
curl -s https://mukbuddy.com/ads | grep -oE '<h1[^>]*>[^<]{0,80}' | head -1

# Per-route titles must differ:
curl -s https://mukbuddy.com/      | grep -oE '<title>[^<]+</title>'
curl -s https://mukbuddy.com/ads   | grep -oE '<title>[^<]+</title>'
curl -s https://mukbuddy.com/thank-you | grep -oE '<title>[^<]+</title>'

# No empty root div anywhere:
for path in / /ads /thank-you; do
  echo -n "$path → empty roots: "
  curl -s "https://mukbuddy.com$path" | grep -c '<div id="root"></div>'
done
# Expect 0 on every route.
```
