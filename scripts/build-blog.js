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
// Render into public/ so the React dev server can preview, and CRA copies
// everything in public/ into build/ at production build time.
const PUBLIC_DIR = path.join(ROOT, "frontend", "public");
const BUILD_DIR = PUBLIC_DIR;
const BLOG_OUT = path.join(PUBLIC_DIR, "blog");
const SITE_URL = "https://mukbuddy.com";

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
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const today = new Date().toISOString().slice(0, 10);
  return fs
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
        tags: Array.isArray(data.tags) ? data.tags : [],
        publish_date: data.publish_date || today,
        html,
      };
    })
    .filter((p) => p.publish_date <= today) // hide future-dated drafts
    .sort((a, b) => (a.publish_date < b.publish_date ? 1 : -1));
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
</style>

${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
</head>
<body>

<header class="nav">
  <a href="/" class="brand">MUK&nbsp;BUDDY</a>
  <nav>
    <a href="/">Home</a>
    <a href="/blog">Blog</a>
    <a href="/#contact">Contact</a>
  </nav>
</header>

${body}

<footer class="foot">
  Muk Buddy · <a href="/">Home</a> · <a href="/blog">Blog</a> · <a href="/#contact">Contact</a><br/>
  <small>© ${new Date().getFullYear()} Muk Buddy</small>
</footer>
</body></html>`;
}

function renderPost(p) {
  const url = `${SITE_URL}/blog/${p.slug}`;
  const heroImg = p.hero_image
    ? `<img class="hero-img" src="${esc(p.hero_image)}" alt="${esc(p.hero_alt)}" />`
    : "";
  const tags = p.tags.length
    ? `<div style="margin-bottom:24px">${p.tags
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join("")}</div>`
    : "";

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
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
  });

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
  ${tags}
  <article class="post">${p.html}</article>

  <div class="cta-card">
    <h3>Stop paying the bag tax.</h3>
    <p>One reusable Muk Buddy replaces years of disposable bags. No filters. No motor death.</p>
    <a class="btn" href="https://thefloorlord.com/product/muk-buddy/" rel="noopener noreferrer" target="_blank">Order Muk Buddy →</a>
  </div>

  <p style="margin-top:32px"><a href="/blog">← Back to all posts</a></p>
</main>`;

  return pageShell({
    title: `${p.title} | Muk Buddy Blog`,
    description: p.excerpt,
    canonical: url,
    ogImage: p.hero_image,
    jsonLd,
    body,
  });
}

function renderIndex(posts) {
  const url = `${SITE_URL}/blog`;
  const cards = posts
    .map((p) => {
      const bg = p.hero_image ? `background-image:url('${esc(p.hero_image)}')` : "";
      return `<a class="card" href="/blog/${esc(p.slug)}">
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
    body,
  });
}

function renderRss(posts) {
  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/blog/${p.slug}`;
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
    <link>${SITE_URL}/blog</link>
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
    { loc: `${SITE_URL}/blog`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_URL}/#contact`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_URL}/#faq`, priority: "0.6", changefreq: "monthly" },
  ];
  const postUrls = posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
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

  const posts = loadPosts();
  console.log(`Found ${posts.length} published blog post(s).`);

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

  console.log("✓ Blog build complete.");
}

main();
