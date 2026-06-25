#!/usr/bin/env node
/**
 * Muk Buddy blog builder.
 *
 * Reads Markdown posts from /content/blog/*.md, renders each as a complete
 * static HTML page (no React), and emits:
 *   build/blog/index.html              ← paginated listing
 *   build/blog/<slug>/index.html       ← per-post pages
 *   build/feed.xml                     ← RSS
 *   build/sitemap.xml                  ← regenerated with blog URLs appended
 *
 * Security:
 *   • Markdown → HTML with `marked` (no inline HTML allowed)
 *   • Output sanitized with `sanitize-html` (strict allowlist)
 *   • Frontmatter fields HTML-escaped
 *   • Future-dated posts are excluded from the build
 *   • No script tags ever — content is text + safe tags only
 *
 * Run AFTER `react-scripts build`:
 *   yarn build      # builds React → build/
 *   node scripts/build-blog.js
 *
 * The "build:blog" yarn script does both.
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");

// ─── Output directory ───────────────────────────────────────────────────────
// In dev / full-build mode (default), render into `frontend/public/` so the
// React dev server can preview and CRA's production build copies everything
// in `public/` into `build/`.
//
// On the live Pair VPS — where there's no Chromium and the CRA build cannot
// run — Otto needs to regenerate ONLY the blog static HTML + sitemap/feed
// directly into the served `build/` tree. Set the env var
//   BLOG_OUTPUT_DIR=/absolute/path/to/build
// and this script writes blog/, sitemap.xml, and feed.xml into THAT directory
// while leaving the prerendered build/index.html, build/ads/, build/thank-you/
// completely untouched. Pair-friendly: pure Node, no React, no browser.
const PUBLIC_DIR = path.join(ROOT, "frontend", "public");
const OUTPUT_DIR = process.env.BLOG_OUTPUT_DIR
  ? path.resolve(process.env.BLOG_OUTPUT_DIR)
  : PUBLIC_DIR;
const BUILD_DIR = OUTPUT_DIR;
const BLOG_OUT = path.join(OUTPUT_DIR, "blog");
const SITE_URL = "https://mukbuddy.com";

// Lightweight .env loader (no external dep). Reads frontend/.env and
// populates process.env for any keys that aren't already set. We only care
// about BLOG_DRAFT_TOKEN here, but the loader is generic.
function loadDotEnv() {
  const envPath = path.join(ROOT, "frontend", ".env");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadDotEnv();

// Secret token for unpublished draft previews. If unset, draft generation is skipped.
// Drafts render to /blog/draft-preview/<TOKEN>/<slug>/ — the URL itself is the secret.
// Rotate by changing this env var (and rebuilding).
const DRAFT_TOKEN = (process.env.BLOG_DRAFT_TOKEN || "").trim();
const DRAFT_OUT_ROOT = DRAFT_TOKEN
  ? path.join(BLOG_OUT, "draft-preview", DRAFT_TOKEN)
  : null;

/* ──────────────────────────── helpers ──────────────────────────── */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Canonical post URL — trailing slash matches what /blog/<slug>/index.html
// is served as. The no-slash form 301-redirects to the slash form, so all
// canonical/og:url/sitemap/RSS/internal links must include the slash to
// avoid pointing at a redirect (an SEO penalty).
function postUrl(slug) {
  return `${SITE_URL}/blog/${slug}/`;
}

// Extract the 11-char YouTube video ID from any common URL form:
//   https://youtu.be/<id>
//   https://www.youtube.com/watch?v=<id>
//   https://www.youtube.com/embed/<id>
//   https://www.youtube.com/shorts/<id>
//   or a bare 11-char ID.
// Returns null if no valid ID is found.
function ytId(v) {
  if (!v) return null;
  const s = String(v).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

const sanitizeOpts = {
  allowedTags: [
    "p", "br", "strong", "em", "a", "ul", "ol", "li",
    "h2", "h3", "h4", "blockquote", "code", "pre",
    "img", "table", "thead", "tbody", "tr", "th", "td", "hr",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "loading"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (tag, attribs) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        target: /^https?:\/\//.test(attribs.href || "") &&
          !(attribs.href || "").startsWith(SITE_URL)
          ? "_blank"
          : "_self",
      },
    }),
    img: (tag, attribs) => ({
      tagName: "img",
      attribs: { ...attribs, loading: "lazy" },
    }),
  },
};

/* ──────────────────────── parse all posts ──────────────────────── */

function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return { published: [], drafts: [] };
  const today = new Date().toISOString().slice(0, 10);
  const all = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
      const { data, content } = matter(raw);
      const fileSlug = f.replace(/\.md$/, "");
      const slug = (data.slug || fileSlug).trim();
      if (slug !== fileSlug) {
        console.warn(
          `WARN  ${f}: frontmatter slug "${slug}" doesn't match filename ` +
            `"${fileSlug}". Using filename as authoritative slug.`
        );
      }
      const html = sanitizeHtml(
        marked.parse(content, { gfm: true, breaks: false }),
        sanitizeOpts
      );
      return {
        slug: fileSlug,
        title: data.title || fileSlug,
        excerpt: data.excerpt || "",
        hero_image: data.hero_image || "",
        hero_alt: data.hero_alt || data.title || "",
        author: data.author || "Muk Buddy",
        author_bio: data.author_bio || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        publish_date: data.publish_date || today,
        // ── Optional video block ──
        video: data.video || "",
        video_title: data.video_title || data.title || fileSlug,
        video_desc: data.video_desc || data.excerpt || "",
        video_thumb: data.video_thumb || "",
        video_date: data.video_date || data.publish_date || today,
        video_vertical: data.video_vertical === true,
        // ── Optional FAQ block ──
        faq: Array.isArray(data.faq)
          ? data.faq.filter((f) => f && f.q && f.a)
          : [],
        // ── Optional ItemList block (ranked "best X" roundups) ──
        item_list_name: data.item_list_name || data.title || fileSlug,
        item_list: Array.isArray(data.item_list)
          ? data.item_list.filter((i) => i && i.name)
          : [],
        // Explicit `published: false` => draft. Future-dated => draft too.
        _isDraft:
          data.published === false || (data.publish_date || today) > today,
        html,
      };
    });

  const published = all
    .filter((p) => !p._isDraft)
    .sort((a, b) => (a.publish_date < b.publish_date ? 1 : -1));
  const drafts = all
    .filter((p) => p._isDraft)
    .sort((a, b) => (a.publish_date < b.publish_date ? 1 : -1));
  return { published, drafts };
}

/* ─────────────────────── HTML templates ─────────────────────── */

function pageShell({ title, description, canonical, ogImage, robots, jsonLd, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(canonical)}" />
<meta name="robots" content="${esc(robots || "index, follow, max-image-preview:large")}" />

<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(canonical)}" />
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}" />` : ""}
<meta property="og:site_name" content="Muk Buddy" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}" />` : ""}

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Anton&family=Bangers&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

<link rel="icon" href="/favicon.ico" />

<style>
:root {
  --cream:#FFF4D6; --cream-2:#FFF9E8; --ink:#1A0625; --muk:#7A6FE0;
  --slime:#39FF14; --slime-600:#1FAB07;
}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.65}
a{color:var(--muk);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}
a:hover{color:var(--ink);background:var(--slime)}
header.nav{background:var(--ink);color:var(--cream);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:4px solid var(--slime)}
header.nav a.brand{color:var(--cream);font-family:'Bowlby One',Impact,sans-serif;font-size:22px;text-decoration:none;letter-spacing:.08em}
header.nav a.brand:hover{background:transparent;color:var(--slime)}
header.nav nav a{color:var(--cream);font-family:Bangers,Impact,sans-serif;font-size:18px;letter-spacing:.15em;margin-left:18px;text-decoration:none;text-transform:uppercase}
header.nav nav a:hover{color:var(--slime);background:transparent}
main{max-width:760px;margin:0 auto;padding:48px 24px 80px}
main.wide{max-width:1100px}
.kicker{font-family:Bangers,Impact,sans-serif;font-size:14px;letter-spacing:.3em;color:var(--muk);text-transform:uppercase;margin:0 0 12px}
h1.title{font-family:'Bowlby One',Impact,sans-serif;font-size:clamp(2rem,4vw,3.5rem);line-height:1.05;margin:0 0 16px;color:var(--ink)}
.byline{font-family:Inter,sans-serif;font-size:14px;color:#5A4A72;margin-bottom:32px}
.byline .dot{margin:0 8px;opacity:.5}
.hero-img{width:100%;border:4px solid var(--ink);margin:8px 0 36px;display:block}
.post{font-size:18px}
.post p,.post ul,.post ol,.post blockquote,.post table{margin:0 0 22px}
.post h2{font-family:Anton,Impact,sans-serif;font-size:32px;line-height:1.1;margin:40px 0 18px;letter-spacing:.01em}
.post h3{font-family:Anton,Impact,sans-serif;font-size:22px;margin:32px 0 14px}
.post ul,.post ol{padding-left:24px}
.post li{margin:6px 0}
.post blockquote{border-left:4px solid var(--muk);padding:8px 18px;background:var(--cream-2);font-style:italic;font-size:19px}
.post code{background:var(--cream-2);padding:2px 6px;border-radius:3px;font-size:.92em}
.post pre{background:var(--ink);color:var(--cream);padding:16px;overflow:auto;border:2px solid var(--ink)}
.post pre code{background:transparent;color:inherit;padding:0}
.post img{max-width:100%;height:auto;border:3px solid var(--ink)}
.post table{width:100%;border-collapse:collapse}
.post th,.post td{border:2px solid var(--ink);padding:10px;text-align:left}
.post th{background:var(--muk);color:var(--cream);font-family:Anton,sans-serif;text-transform:uppercase;font-size:14px;letter-spacing:.05em}
.tag{display:inline-block;background:var(--ink);color:var(--cream);font-family:Bangers,sans-serif;font-size:13px;letter-spacing:.15em;padding:3px 10px;margin-right:6px;text-transform:uppercase}
.cta-card{margin-top:48px;padding:24px;background:var(--ink);color:var(--cream);border:4px solid var(--slime);text-align:center}
.cta-card h3{font-family:'Bowlby One',Impact,sans-serif;font-size:28px;margin:0 0 8px;color:var(--cream)}
.cta-card p{color:var(--cream);opacity:.85;margin:0 0 18px}
.cta-card a.btn{display:inline-block;background:var(--slime);color:var(--ink);font-family:Bangers,sans-serif;font-size:20px;letter-spacing:.15em;padding:12px 24px;border:3px solid var(--cream);text-decoration:none;text-transform:uppercase}
.cta-card a.btn:hover{background:var(--cream);background:#a4ff5a}
footer.foot{background:var(--ink);color:var(--cream);padding:32px 24px;text-align:center;font-size:13px}
footer.foot a{color:var(--slime);background:transparent}
.list-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-top:32px}
.card{background:#fff;border:3px solid var(--ink);text-decoration:none;color:var(--ink);display:block;transition:transform .15s}
.card:hover{transform:translate(-2px,-2px);background:#fff}
.card .ph{height:180px;background:var(--cream-2) center/cover no-repeat;border-bottom:3px solid var(--ink)}
.card .body{padding:16px 18px}
.card .meta{font-family:Bangers,sans-serif;font-size:12px;letter-spacing:.2em;color:var(--muk);text-transform:uppercase}
.card h2{font-family:Anton,sans-serif;font-size:22px;line-height:1.15;margin:6px 0 10px}
.card p{font-size:14px;color:#5A4A72;margin:0}
.video-wrap{position:relative;width:100%;padding-top:56.25%;margin:0 0 36px;border:4px solid var(--ink);background:#000;overflow:hidden}
.video-wrap.vertical{padding-top:0;aspect-ratio:9/16;max-width:380px;margin:0 auto 36px;display:block}
.video-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
.faq{margin:48px 0 8px;border-top:3px solid var(--ink);padding-top:32px}
.faq > h2{font-family:Anton,Impact,sans-serif;font-size:28px;margin:0 0 18px}
.faq details{background:#fff;border:3px solid var(--ink);padding:14px 18px;margin:0 0 12px}
.faq details[open]{background:var(--cream-2)}
.faq summary{cursor:pointer;font-family:Anton,Impact,sans-serif;font-size:19px;line-height:1.25;list-style:none;outline-offset:3px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:'+';float:right;font-family:'Bowlby One',sans-serif;color:var(--muk);font-size:22px;line-height:1;margin-left:12px}
.faq details[open] summary::after{content:'–'}
.faq .a{margin-top:12px;font-size:16px;line-height:1.6}
.faq .a p{margin:0 0 12px}
.faq .a p:last-child{margin:0}
.author-box{margin:48px 0 8px;padding:20px 22px;background:var(--cream-2);border-left:6px solid var(--muk);font-size:15px;line-height:1.55}
.author-box .name{font-family:Anton,Impact,sans-serif;font-size:18px;letter-spacing:.04em;margin:0 0 6px;text-transform:uppercase;color:var(--ink)}
.author-box p{margin:0;color:#3a2a55}
</style>

${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
</head>
<body>

<header class="nav">
  <a href="/" class="brand">MUK&nbsp;BUDDY</a>
  <nav>
    <a href="/">Home</a>
    <a href="/blog/">Blog</a>
    <a href="/#contact">Contact</a>
  </nav>
</header>

${body}

<footer class="foot">
  Muk Buddy · <a href="/">Home</a> · <a href="/blog/">Blog</a> · <a href="/#contact">Contact</a><br/>
  <small>© ${new Date().getFullYear()} Muk Buddy</small>
</footer>
</body></html>`;
}

function renderPost(p) {
  const url = postUrl(p.slug);
  const heroImg = p.hero_image
    ? `<img class="hero-img" src="${esc(p.hero_image)}" alt="${esc(p.hero_alt)}" />`
    : "";
  const tags = p.tags.length
    ? `<div style="margin-bottom:24px">${p.tags
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join("")}</div>`
    : "";

  const videoBlock = renderVideoBlock(p);
  const faqBlock = renderFaqBlock(p);
  const authorBlock = renderAuthorBlock(p);

  /* ─── Schema as @graph ─── */
  const graph = [
    {
      "@type": "BlogPosting",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: p.title,
      description: p.excerpt,
      image: p.hero_image ? [p.hero_image] : undefined,
      datePublished: p.publish_date,
      dateModified: p.publish_date,
      author: { "@type": "Person", name: p.author },
      publisher: {
        "@type": "Organization",
        name: "Muk Buddy",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
      },
    },
  ];

  const vid = ytId(p.video);
  if (vid) {
    graph.push({
      "@type": "VideoObject",
      name: p.video_title,
      description: p.video_desc,
      thumbnailUrl:
        p.video_thumb || `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`,
      uploadDate: p.video_date,
      embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
      contentUrl: `https://www.youtube.com/watch?v=${vid}`,
    });
  }

  if (p.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: p.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (p.item_list.length) {
    graph.push({
      "@type": "ItemList",
      name: p.item_list_name,
      url,
      numberOfItems: p.item_list.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: p.item_list.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url || url,
        description: it.description || undefined,
      })),
    });
  }

  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });

  const body = `
<main>
  <p class="kicker">From the Field</p>
  <h1 class="title">${esc(p.title)}</h1>
  <div class="byline">
    By ${esc(p.author)}<span class="dot">·</span>
    <time datetime="${esc(p.publish_date)}">${new Date(p.publish_date).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )}</time>
  </div>
  ${heroImg}
  ${videoBlock}
  ${tags}
  <article class="post">${p.html}</article>
  ${faqBlock}
  ${authorBlock}

  <div class="cta-card">
    <h3>Stop paying the bag tax.</h3>
    <p>One reusable Muk Buddy replaces years of disposable bags. No filters. No motor death.</p>
    <a class="btn" href="/">Get Muk Buddy &rarr;</a>
  </div>

  <p style="margin-top:32px"><a href="/blog/">&larr; Back to all posts</a></p>
</main>`;

  return pageShell({
    title: `${p.title} | Muk Buddy Blog`,
    description: p.excerpt,
    canonical: url,
    ogImage: p.hero_image || `${SITE_URL}/og-image-home.png`,
    jsonLd,
    body,
  });
}

/* ─── shared block renderers (used by both published + draft pages) ─── */

function renderVideoBlock(p) {
  const vid = ytId(p.video);
  if (!vid) return "";
  // youtube-nocookie.com avoids dropping a tracking cookie until play.
  const src = `https://www.youtube-nocookie.com/embed/${vid}?rel=0`;
  const wrapCls = p.video_vertical ? "video-wrap vertical" : "video-wrap";
  return `<div class="${wrapCls}">
  <iframe src="${esc(src)}" title="${esc(p.video_title)}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen loading="lazy"></iframe>
</div>`;
}

function renderFaqBlock(p) {
  if (!p.faq.length) return "";
  const items = p.faq
    .map((f) => {
      const ans = sanitizeHtml(marked.parse(f.a, { gfm: true, breaks: false }), sanitizeOpts);
      return `  <details>
    <summary>${esc(f.q)}</summary>
    <div class="a">${ans}</div>
  </details>`;
    })
    .join("\n");
  return `<section class="faq" aria-label="Frequently asked questions">
  <h2>FAQ</h2>
${items}
</section>`;
}

function renderAuthorBlock(p) {
  if (!p.author_bio) return "";
  const bioHtml = sanitizeHtml(
    marked.parse(p.author_bio, { gfm: true, breaks: false }),
    sanitizeOpts
  );
  return `<aside class="author-box">
  <p class="name">About ${esc(p.author)}</p>
  ${bioHtml}
</aside>`;
}

/* ───────────── draft preview (token-gated, noindex) ───────────── */

const DRAFT_BANNER = `
<div style="background:#FFD400;color:#1A0625;border:4px solid #1A0625;padding:14px 18px;margin:0 0 24px;font-family:Anton,Impact,sans-serif;font-size:16px;letter-spacing:.08em;text-transform:uppercase;line-height:1.3">
  🚧 DRAFT PREVIEW — not published. This page is hidden from search engines and the public blog index. Set <code>published: true</code> in the post's frontmatter to go live.
</div>`;

function renderDraftPost(p, token) {
  const heroImg = p.hero_image
    ? `<img class="hero-img" src="${esc(p.hero_image)}" alt="${esc(p.hero_alt)}" />`
    : "";
  const tags = p.tags.length
    ? `<div style="margin-bottom:24px">${p.tags
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join("")}</div>`
    : "";

  const videoBlock = renderVideoBlock(p);
  const faqBlock = renderFaqBlock(p);
  const authorBlock = renderAuthorBlock(p);

  const body = `
<main>
  ${DRAFT_BANNER}
  <p class="kicker">Draft Preview</p>
  <h1 class="title">${esc(p.title)}</h1>
  <div class="byline">
    By ${esc(p.author)}<span class="dot">·</span>
    <time datetime="${esc(p.publish_date)}">${new Date(p.publish_date).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )}</time>
  </div>
  ${heroImg}
  ${videoBlock}
  ${tags}
  <article class="post">${p.html}</article>
  ${faqBlock}
  ${authorBlock}

  <p style="margin-top:32px"><a href="/blog/draft-preview/${esc(token)}/">&larr; All drafts</a></p>
</main>`;

  return pageShell({
    title: `[DRAFT] ${p.title}`,
    description: p.excerpt,
    canonical: postUrl(p.slug), // canonical to future live URL (with trailing slash)
    ogImage: p.hero_image || `${SITE_URL}/og-image-home.png`,
    robots: "noindex, nofollow",
    body,
  });
}

function renderDraftIndex(drafts, token) {
  const cards = drafts
    .map((p) => {
      const bg = p.hero_image ? `background-image:url('${esc(p.hero_image)}')` : "";
      return `<a class="card" href="/blog/draft-preview/${esc(token)}/${esc(p.slug)}/">
  <div class="ph" style="${bg}"></div>
  <div class="body">
    <div class="meta">Draft · ${esc(p.publish_date)}</div>
    <h2>${esc(p.title)}</h2>
    <p>${esc(p.excerpt)}</p>
  </div>
</a>`;
    })
    .join("\n");

  const empty = `<p style="margin-top:32px;color:#5A4A72">No drafts. Add a <code>.md</code> with <code>published: false</code> to <code>/content/blog/</code>.</p>`;

  const body = `
<main class="wide">
  ${DRAFT_BANNER}
  <p class="kicker">Internal</p>
  <h1 class="title">Draft Previews</h1>
  <p style="font-size:18px;color:#5A4A72;max-width:560px">
    Unpublished posts. Set <code>published: true</code> in frontmatter to promote them to the public blog.
  </p>
  ${drafts.length ? `<div class="list-grid">${cards}</div>` : empty}
</main>`;

  return pageShell({
    title: "Draft Previews",
    description: "Internal draft preview index.",
    canonical: `${SITE_URL}/blog/draft-preview/${token}/`,
    robots: "noindex, nofollow",
    body,
  });
}

function renderIndex(posts) {
  const url = `${SITE_URL}/blog/`;
  const cards = posts
    .map((p) => {
      const bg = p.hero_image ? `background-image:url('${esc(p.hero_image)}')` : "";
      return `<a class="card" href="/blog/${esc(p.slug)}/">
  <div class="ph" style="${bg}"></div>
  <div class="body">
    <div class="meta">${esc(
      new Date(p.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    )}</div>
    <h2>${esc(p.title)}</h2>
    <p>${esc(p.excerpt)}</p>
  </div>
</a>`;
    })
    .join("\n");

  const empty = `<p style="margin-top:32px;color:#5A4A72">No posts yet. Check back soon.</p>`;

  const body = `
<main class="wide">
  <p class="kicker">From the Field</p>
  <h1 class="title">Muk Buddy Blog</h1>
  <p style="font-size:18px;color:#5A4A72;max-width:560px">
    Hands-on guides, real cost breakdowns, and field-tested tips for contractors who actually use their wet/dry vacs.
  </p>
  ${posts.length ? `<div class="list-grid">${cards}</div>` : empty}
</main>`;

  return pageShell({
    title: "Blog | Muk Buddy — Shop Vac Tips, Cost Breakdowns, Field Guides",
    description:
      "Hands-on guides, cost breakdowns, and field-tested tips for contractors using wet/dry vacs.",
    canonical: url,
    ogImage: `${SITE_URL}/og-image-home.png`,
    body,
  });
}

function renderRss(posts) {
  const items = posts
    .map((p) => {
      const link = postUrl(p.slug);
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.publish_date).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Muk Buddy Blog</title>
    <link>${SITE_URL}/blog/</link>
    <description>Field-tested tips and cost breakdowns for wet/dry vacuum users.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

function renderSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);
  const base = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${SITE_URL}/blog/`, priority: "0.8", changefreq: "weekly" },
  ];
  const postUrls = posts.map((p) => ({
    loc: postUrl(p.slug),
    priority: "0.7",
    changefreq: "monthly",
    lastmod: p.publish_date,
  }));
  const urls = [...base, ...postUrls]
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/* ──────────────────────── main ──────────────────────── */

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf-8");
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`ERR  ${PUBLIC_DIR} doesn't exist.`);
    process.exit(1);
  }

  const { published: posts, drafts } = loadPosts();
  console.log(`Found ${posts.length} published post(s) and ${drafts.length} draft(s).`);

  ensureDir(BLOG_OUT);

  writeFile(path.join(BLOG_OUT, "index.html"), renderIndex(posts));
  console.log(`  → wrote build/blog/index.html`);

  for (const p of posts) {
    writeFile(path.join(BLOG_OUT, p.slug, "index.html"), renderPost(p));
    console.log(`  → wrote build/blog/${p.slug}/index.html`);
  }

  writeFile(path.join(BUILD_DIR, "feed.xml"), renderRss(posts));
  console.log(`  → wrote build/feed.xml`);

  writeFile(path.join(BUILD_DIR, "sitemap.xml"), renderSitemap(posts));
  console.log(`  → wrote build/sitemap.xml (rebuilt with blog URLs)`);

  // Manifest used by the React landing page footer strip
  // (latest 3 posts shown under "Latest from the Field").
  const manifest = posts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    hero_image: p.hero_image,
    publish_date: p.publish_date,
  }));
  writeFile(
    path.join(BUILD_DIR, "blog", "posts.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`  → wrote build/blog/posts.json`);

  /* ────────── draft preview pipeline (token-gated) ────────── */
  // First, scrub any old draft-preview output so a rotated token leaves nothing behind.
  const draftRoot = path.join(BLOG_OUT, "draft-preview");
  if (fs.existsSync(draftRoot)) {
    fs.rmSync(draftRoot, { recursive: true, force: true });
    console.log(`  → cleared old draft-preview output`);
  }

  if (drafts.length === 0) {
    console.log("No drafts present — skipping draft-preview build.");
  } else if (!DRAFT_TOKEN) {
    console.warn(
      `WARN  ${drafts.length} draft(s) found but BLOG_DRAFT_TOKEN is not set. ` +
        `Skipping draft preview generation. Set BLOG_DRAFT_TOKEN in frontend/.env to enable.`
    );
  } else if (DRAFT_TOKEN.length < 16) {
    console.warn(
      `WARN  BLOG_DRAFT_TOKEN is too short (${DRAFT_TOKEN.length} chars). ` +
        `Use at least 16 random chars. Skipping draft preview generation.`
    );
  } else {
    ensureDir(DRAFT_OUT_ROOT);
    writeFile(
      path.join(DRAFT_OUT_ROOT, "index.html"),
      renderDraftIndex(drafts, DRAFT_TOKEN)
    );
    console.log(`  → wrote build/blog/draft-preview/<TOKEN>/index.html`);
    for (const p of drafts) {
      writeFile(
        path.join(DRAFT_OUT_ROOT, p.slug, "index.html"),
        renderDraftPost(p, DRAFT_TOKEN)
      );
      console.log(`  → wrote build/blog/draft-preview/<TOKEN>/${p.slug}/index.html`);
    }
    console.log(
      `✓ Draft previews ready. Visit /blog/draft-preview/${DRAFT_TOKEN}/ to view.`
    );
  }

  console.log("✓ Blog build complete.");
}

main();
