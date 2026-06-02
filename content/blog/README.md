# How to write a Muk Buddy blog post

This folder holds the source for every blog post on `mukbuddy.com/blog`.

## Author a new post (the secure way)

1. Go to your repo on **github.com** in your browser (signed in with 2FA enabled).
2. Navigate to `content/blog/`.
3. Click **Add file → Create new file**.
4. Name it like `your-post-slug.md` (use kebab-case — no spaces, lowercase).
5. Paste the template below and replace the contents.
6. Commit → site rebuild kicks off → post is live in a few minutes.

That's it. No login on the live server. No admin UI. No file upload endpoints.
All authoring goes through GitHub's auth + audit trail.

---

## Post template — copy this and edit

```markdown
---
title: "Your post title here (this becomes the H1 and the <title> tag)"
slug: "your-post-slug"            # MUST match the filename without .md
excerpt: "One- or two-sentence preview shown on the /blog index page and in social previews. ~155 chars max for clean Google snippets."
hero_image: "/images/blog/your-hero.jpg"   # 1200x630 recommended. Upload via the same GitHub flow.
hero_alt: "Descriptive alt text for the hero image — important for SEO + accessibility."
author: "Jed Hartman"             # appears in the byline + JSON-LD
tags: ["shop-vac", "drywall"]     # 1–4 lowercase tags for grouping
publish_date: "2026-05-21"        # ISO date. Future dates = scheduled (post hidden until then).
---

Write your post in **Markdown** below the `---` block.

## Subheadings use double-hash
### And triple-hash for sub-subheadings

Bullet lists:

- Strong, scannable points
- Contractor language, no fluff
- Real numbers where possible

Bold uses **double asterisks**. Italic uses *single asterisks*.

Links are inline: [link text](https://destination.com).

Images inside the body:

![Alt text describing the image](/images/blog/your-image.jpg)

> Pull-quotes use a leading angle bracket. Great for testimonials or punchline moments.

End every post with a 1–2 sentence wrap + a CTA, e.g.:

If you're tired of buying disposable bags every month, [grab a Muk Buddy](https://thefloorlord.com/product/muk-buddy/) and never deal with it again.
```

---

## Rules / Best practices

| Rule | Why |
|---|---|
| Always set `title`, `excerpt`, `hero_image`, `publish_date` | SEO + social previews break without these |
| Slug must match filename | The build wiring relies on this |
| Hero image 1200×630px | Standard OG/Twitter card size — looks right in Facebook, LinkedIn, Twitter previews |
| Don't paste raw HTML / `<script>` tags | The build sanitizes Markdown and strips unsafe HTML. Safe markdown only |
| One `# heading` only — and the build adds it automatically from your `title` | Don't put `# Title` in the body |
| Keep paragraphs short (2–3 sentences) | Contractor-friendly, mobile-readable |
| Aim for 800–1500 words | Sweet spot for SEO ranking on niche terms |
| Use real numbers and brand names | Long-tail keywords (e.g. "Ridgid 16 gallon shop vac filter") drive search traffic |

---

## What happens after you commit

1. Your push triggers your CI/CD (or your manual deploy step)
2. `scripts/build-blog.js` reads every `.md` in this folder
3. Renders each as a clean static HTML page at `mukbuddy.com/blog/<slug>`
4. Regenerates the `/blog` index page (paginated, latest first)
5. Regenerates `sitemap.xml` to include all posts
6. Regenerates `/feed.xml` (RSS)
7. Apache serves the static HTML files directly — zero database calls, zero new attack surface

---

## Draft previews (preview before going live)

You can preview a post on the live site **before** publishing it, without ever exposing a login.

### How it works
- Add a Markdown file with `published: false` in the frontmatter (see `sample-draft-...md` for an example).
- The build emits the page at a **secret URL**:
  `https://mukbuddy.com/blog/draft-preview/<TOKEN>/<slug>/`
- The token is stored in `frontend/.env` as `BLOG_DRAFT_TOKEN` (only on your machine and your VPS, **never** in GitHub — the `draft-preview/` folder is `.gitignore`'d).
- Drafts are excluded from `posts.json`, `sitemap.xml`, `feed.xml`, and the public `/blog` index.
- Each draft page carries `<meta name="robots" content="noindex, nofollow">` plus `Disallow: /blog/draft-preview/` in `robots.txt`.

### Workflow
1. Write your draft `.md` in `content/blog/` with `published: false`.
2. Commit + push (Apache auto-deploys via webhook).
3. The VPS rebuilds with its `BLOG_DRAFT_TOKEN` and writes the draft pages.
4. Visit `https://mukbuddy.com/blog/draft-preview/<TOKEN>/` (find the token in the server's `frontend/.env`).
5. Review, share the URL privately with a teammate if needed.
6. When ready: flip `published: true` (and update `publish_date` if needed). Push. It goes live at `/blog/<slug>`.

### Rotating the token
Edit `BLOG_DRAFT_TOKEN` in `frontend/.env` on the VPS, then run `yarn build:blog`. The old draft URLs immediately become 404.

### Get the token (local dev)
```bash
grep BLOG_DRAFT_TOKEN /app/frontend/.env
```
Visit: `http://<preview-url>/blog/draft-preview/<TOKEN>/`
