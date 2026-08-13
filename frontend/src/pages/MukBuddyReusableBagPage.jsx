import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Lock, Flag, Award, ShieldCheck, ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import PageHead from "@/components/PageHead";
import { IMAGES } from "@/lib/images";
import { appendAttribution } from "@/lib/attribution";

/**
 * Muk Buddy — Money Page (/muk-buddy-reusable-bag/)
 * ─────────────────────────────────────────────────────────────────────
 * Purpose:  SEO destination for the terms "reusable shop vac bag" and
 *           "reusable wet dry vac bag". Consolidates the authority the
 *           99-post blog has been pointing at the (generic) homepage.
 * Spec:     /app/artifacts/muk-buddy-reusable-bag-PAGE-SPEC-v1.md
 * Rules:    - patent-pending never "patented"
 *           - no competitor names, no motive imputation
 *           - "subscription" never "bag tax"
 *           - no invented numbers — only $99, hundreds of disposables,
 *             fits most wet/dry vacs, 2-chamber, patent pending, USA
 *           - washing is a maintenance detail, not a selling point
 *           - no free-shipping/limited-time filler
 * SEO:      indexable · canonical to self · in sitemap @ 0.9
 * ─────────────────────────────────────────────────────────────────────
 */

const CHECKOUT_URL =
  "https://thefloorlord.com/checkout/?add-to-cart=6541&quantity=1";
const CANONICAL_URL = "https://mukbuddy.com/muk-buddy-reusable-bag/";
const PRODUCT_IMAGE_URL = "https://mukbuddy.com/img/product-shot-detail.jpg";

const FAQ_ITEMS = [
  {
    q: "Is Muk Buddy really reusable, or does it wear out like a paper bag?",
    a: "It's built to be used over and over. Paper bags are designed to be thrown away — that's the model we're replacing.",
    link: {
      href: "/blog/reusable-vacuum-bag-lifespan/",
      label: "How long a reusable shop vac bag actually lasts",
    },
  },
  {
    q: "Will it fit my vacuum?",
    a: "It fits most standard wet/dry vacs, including common RIDGID, DeWalt, and Craftsman models.",
  },
  {
    q: "Does it work for drywall and concrete dust?",
    a: "That's what the two-chamber design is for. Fine dust drops out in the outer chamber instead of loading your filter.",
    link: {
      href: "/blog/hepa-shop-vac-bag-fine-dust-silica/",
      label: "HEPA shop vac bags & fine dust filtration",
    },
  },
  {
    q: "Can I use it for wet pickup?",
    a: "Muk Buddy is a wet/dry vac bag. Follow your vacuum's instructions for switching between dry and wet pickup.",
    link: {
      href: "/blog/switch-shop-vacuum-dry-to-wet/",
      label: "Switching your shop vacuum from dry to wet",
    },
  },
  {
    q: "Do I still need a filter?",
    a: "Yes — Muk Buddy protects the filter, it doesn't replace it. That's the point: the filter stops getting buried.",
    link: {
      href: "/blog/multi-stage-shop-vacuum-filtration/",
      label: "How multi-stage shop vacuum filtration works",
    },
  },
  {
    q: "How much is it?",
    a: "$99 for one bag, which replaces hundreds of disposables.",
  },
  {
    q: "Where does the order go through?",
    a: "Checkout is handled by The Floor Lord, our fulfillment partner — secure, 256-bit SSL.",
  },
];

/* ─────────────────── JSON-LD schema (Product + FAQ + Breadcrumb) ─────────────────── */
function buildSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Muk Buddy Reusable Shop Vac Bag",
        brand: { "@type": "Brand", name: "Muk Buddy" },
        description:
          "The patent-pending Muk Buddy Reusable Shop Vac Bag uses a 2-chamber design to drop heavy debris and fine dust out before they reach your filter — so suction holds through the job. Fits most 12–20 gallon wet/dry vacuums. Made in the USA.",
        image: PRODUCT_IMAGE_URL,
        url: CANONICAL_URL,
        category: "Wet/Dry Vacuum Bag",
        offers: {
          "@type": "Offer",
          price: "99.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: CHECKOUT_URL,
          seller: { "@type": "Organization", name: "The Floor Lord" },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://mukbuddy.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Muk Buddy Reusable Bag",
            item: CANONICAL_URL,
          },
        ],
      },
    ],
  };
}

/* ─────────────────────────────── Page ─────────────────────────────── */
export default function MukBuddyReusableBagPage() {
  return (
    <main
      data-testid="reusable-bag-page"
      className="bg-cream text-ink overflow-x-hidden"
    >
      <PageHead
        title="Reusable Shop Vac Bag for Wet/Dry Vacs — Muk Buddy ($99)"
        description="The patent-pending reusable shop vac bag with a 2-chamber design that keeps fine dust off your filter. One bag instead of a case every month. Fits most wet/dry vacs."
        canonical={CANONICAL_URL}
        ogImage={PRODUCT_IMAGE_URL}
        productPrice="99.00"
        preloadImage={IMAGES.productShot}
        robots="index, follow, max-image-preview:large"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(buildSchema())}
        </script>
      </Helmet>

      <Header />

      {/* ─────────────────── HERO ─────────────────── */}
      <section
        data-testid="reusable-bag-hero"
        className="relative bg-cream pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden border-b-4 border-ink"
      >
        <div className="absolute inset-0 halftone-cream opacity-70" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb (visible + matches schema) */}
          <nav
            aria-label="Breadcrumb"
            data-testid="breadcrumb"
            className="font-bangers text-sm tracking-[0.2em] text-ink/60 uppercase mb-4"
          >
            <a href="/" className="hover:text-muk">Home</a>
            <span className="mx-2 text-ink/40">/</span>
            <span className="text-ink">Reusable Shop Vac Bag</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Copy column — always first on mobile so CTA sits above fold */}
            <div className="lg:col-span-7 order-1">
              <p className="font-bangers text-sm tracking-[0.3em] text-muk uppercase mb-4">
                Muk Buddy · Patent Pending
              </p>
              <h1
                data-testid="reusable-bag-h1"
                className="font-bowlby text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-ink"
              >
                The Reusable Shop Vac Bag That{" "}
                <span className="hl-slime">Protects Your Filter</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-ink/85 leading-relaxed max-w-2xl">
                One bag with two chambers. Debris and fines drop out before
                they reach your filter — so suction holds through the job
                instead of dying halfway.
              </p>

              <p
                data-testid="hero-price-line"
                className="mt-6 font-bangers text-2xl sm:text-3xl text-ink"
              >
                $99 &mdash;{" "}
                <span className="text-muk">
                  one bag, not a case every month
                </span>
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href={appendAttribution(CHECKOUT_URL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-order-btn"
                  className="sticker-btn inline-flex items-center justify-center gap-3 bg-slime text-ink font-bangers text-xl sm:text-2xl uppercase tracking-wider px-7 py-4 border-4 border-ink rounded-sm shadow-brutal"
                >
                  Order Muk Buddy — $99
                  <ArrowRight className="w-5 h-5" strokeWidth={2.75} />
                </a>
              </div>

              <ul
                data-testid="hero-trust-strip"
                className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-ink/70 font-mono"
              >
                <li className="inline-flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-muk" /> Patent Pending
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-muk" /> Made in the USA
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-muk" /> Fits most wet/dry vacs
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-muk" /> Secure checkout via The Floor Lord
                </li>
              </ul>
            </div>

            {/* Product image */}
            <div className="lg:col-span-5 order-2 relative">
              <div className="relative bg-white border-4 border-ink shadow-brutal p-4 sm:p-6 rotate-1 hover:rotate-0 transition-transform">
                <img
                  src={IMAGES.productShot}
                  alt="Muk Buddy patent-pending reusable shop vac bag for wet/dry vacuums"
                  className="w-full h-auto object-contain aspect-square"
                  width="800"
                  height="800"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  data-testid="hero-product-image"
                />
                <div className="absolute -top-4 -right-3 bg-muk text-cream font-bangers text-sm uppercase tracking-[0.15em] px-3 py-1.5 border-2 border-ink -rotate-3 shadow-brutal-sm">
                  Reusable · Forever
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 1 — Subscription frame ─────────────────── */}
      <section
        id="subscription"
        data-testid="section-subscription"
        className="bg-ink text-cream py-16 sm:py-20 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-bangers text-sm tracking-[0.3em] text-slime uppercase mb-4">
            01 · The subscription you never signed up for
          </p>
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
            Disposable bags are a{" "}
            <span className="text-slime">subscription</span> you never signed up for.
          </h2>
          <div className="mt-6 space-y-5 text-lg text-cream/85 leading-relaxed">
            <p>
              You buy a vac once. Then you buy bags forever. A case here, a
              case there, every month, on every job — and the moment you run
              out, the crew is running the vac bare and wrecking the filter
              instead.
            </p>
            <p>
              That is not a supply cost. It is a recurring charge on a tool
              you already own.
            </p>
            <p className="font-bowlby text-2xl sm:text-3xl text-cream leading-tight">
              Muk Buddy ends it with one bag you keep.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 2 — Filter is the real problem ─────────────────── */}
      <section
        id="filter"
        data-testid="section-filter"
        className="bg-cream py-16 sm:py-20 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-bangers text-sm tracking-[0.3em] text-muk uppercase mb-4">
            02 · The filter is the real problem
          </p>
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-ink">
            Why your suction dies halfway through the job.
          </h2>
          <div className="mt-6 space-y-5 text-lg text-ink/85 leading-relaxed">
            <p>
              Fine dust — drywall, concrete, silica — is small enough to pass
              through a paper bag and pack into the pleats of your filter.
              Once the filter blinds over, airflow drops. Less airflow means
              less pickup, a hotter motor, and a vac that sounds like it's
              working while it's barely lifting anything.
            </p>
            <p className="font-bowlby text-xl sm:text-2xl text-ink leading-snug">
              Most people blame the vacuum. The vacuum is fine. The filter is
              buried.
            </p>
            <p className="text-base text-ink/70">
              Related reading:{" "}
              <a
                href="/blog/why-fine-dust-destroys-vacuums/"
                className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
                data-testid="link-fine-dust"
              >
                Why fine dust destroys vacuums
              </a>{" "}
              &middot;{" "}
              <a
                href="/blog/shop-vac-lost-suction-how-to-fix/"
                className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
                data-testid="link-lost-suction"
              >
                Shop vac lost suction: how to fix it
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 3 — The mechanism (this sells) ─────────────────── */}
      <section
        id="how-it-works"
        data-testid="section-mechanism"
        className="bg-slime/20 py-16 sm:py-20 border-b-4 border-ink"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <p className="font-bangers text-sm tracking-[0.3em] text-muk uppercase mb-4">
              03 · The mechanism
            </p>
            <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-ink">
              Two chambers, one bag &mdash;{" "}
              <span className="text-muk">patent pending.</span>
            </h2>
            <ul className="mt-6 space-y-4 text-lg text-ink/85 leading-relaxed">
              <li>
                <strong className="font-bowlby text-xl text-ink">
                  Outer chamber
                </strong>{" "}
                &mdash; heavy debris and fines drop out here, away from the
                filter.
              </li>
              <li>
                <strong className="font-bowlby text-xl text-ink">
                  Inner chamber
                </strong>{" "}
                &mdash; delivers clean airflow to the motor.
              </li>
            </ul>
            <p className="mt-6 text-lg text-ink/85 leading-relaxed">
              Because the fines never reach the pleats, the filter stays open
              and suction holds through the job. That is the whole product.
              It isn't a thicker bag; it's a different path for the air.
            </p>
            <p className="mt-5 text-base text-ink/70">
              Learn more:{" "}
              <a
                href="/blog/multi-stage-shop-vacuum-filtration/"
                className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
                data-testid="link-multi-stage"
              >
                Multi-stage shop vacuum filtration
              </a>
              .
            </p>
          </div>

          {/* 2-chamber animation (same asset used on /ads) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative bg-ink border-4 border-ink shadow-brutal overflow-hidden aspect-[4/5] max-h-[560px] mx-auto">
              <video
                src={IMAGES.mascotAnimation}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
                data-testid="mechanism-video"
                aria-label="Muk Buddy 2-chamber airflow demonstration — patent-pending reusable shop vac bag"
              />
              <div className="absolute top-3 left-3 bg-muk text-cream text-[10px] font-bangers uppercase tracking-widest px-2 py-1 border-2 border-cream">
                ▶ 2-chamber airflow
              </div>
              <div className="absolute bottom-3 right-3 bg-slime text-ink text-[10px] font-bangers uppercase tracking-widest px-2 py-1 border-2 border-ink">
                Patent Pending
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 4 — Fitment ─────────────────── */}
      <section
        id="fitment"
        data-testid="section-fitment"
        className="bg-cream py-16 sm:py-20 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-bangers text-sm tracking-[0.3em] text-muk uppercase mb-4">
            04 · Fitment
          </p>
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-ink">
            Fits most wet/dry vacs.
          </h2>
          <p className="mt-6 text-lg text-ink/85 leading-relaxed">
            Muk Buddy fits most standard wet/dry vacuums. Common setups:
          </p>
          <ul
            data-testid="fitment-list"
            className="mt-6 space-y-4 text-lg text-ink"
          >
            <li className="flex items-start gap-3">
              <span className="font-bangers text-muk text-xl leading-none mt-1">
                →
              </span>
              <span>
                <strong>RIDGID wet/dry vacs</strong> &mdash;{" "}
                <a
                  href="/blog/reusable-shop-vac-bag-for-ridgid/"
                  className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
                  data-testid="link-ridgid"
                >
                  reusable shop vac bag for RIDGID
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bangers text-muk text-xl leading-none mt-1">
                →
              </span>
              <span>
                <strong>DeWalt &amp; Craftsman</strong> &mdash;{" "}
                <a
                  href="/blog/reusable-shop-vac-bag-for-dewalt-craftsman/"
                  className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
                  data-testid="link-dewalt-craftsman"
                >
                  reusable bag for DeWalt &amp; Craftsman vacuums
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bangers text-muk text-xl leading-none mt-1">
                →
              </span>
              <span>
                Not sure what you have? &mdash;{" "}
                <a
                  href="/blog/what-size-shop-vacuum/"
                  className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
                  data-testid="link-what-size"
                >
                  how to figure out your shop vacuum size
                </a>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ─────────────────── SECTION 5 — What actually changes ─────────────────── */}
      <section
        id="what-changes"
        data-testid="section-what-changes"
        className="bg-muk text-cream py-16 sm:py-20 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-bangers text-sm tracking-[0.3em] text-slime uppercase mb-4">
            05 · What changes on the jobsite
          </p>
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
            What actually changes.
          </h2>
          <ul
            data-testid="what-changes-list"
            className="mt-6 space-y-4 text-lg leading-relaxed"
          >
            {[
              "Suction that holds from the first pass to the last",
              "No mid-job stop to swap a torn bag",
              "No case of bags riding in the truck",
              "One less consumable to forget, reorder, and run out of",
              "Filters that last, because the dust never gets to them",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="font-bangers text-slime text-2xl leading-none mt-0.5">
                  ✓
                </span>
                <span className="text-cream/95">{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base text-cream/80">
            Related reading:{" "}
            <a
              href="/blog/shop-vac-downtime-costing-your-crew/"
              className="underline decoration-slime decoration-2 hover:text-slime font-semibold"
              data-testid="link-downtime"
            >
              Shop vac downtime is costing your crew
            </a>{" "}
            &middot;{" "}
            <a
              href="/blog/reduce-vacuum-bag-filter-costs/"
              className="underline decoration-slime decoration-2 hover:text-slime font-semibold"
              data-testid="link-reduce-costs"
            >
              Cutting recurring vacuum bag &amp; filter costs
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─────────────────── SECTION 6 — Care (short) ─────────────────── */}
      <section
        id="care"
        data-testid="section-care"
        className="bg-cream py-14 sm:py-16 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-bangers text-sm tracking-[0.3em] text-muk uppercase mb-4">
            06 · Care
          </p>
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-ink">
            Cleaning it out.
          </h2>
          <p className="mt-5 text-lg text-ink/85 leading-relaxed">
            Empty it, knock it out, and it's ready for the next job. Full
            care instructions:{" "}
            <a
              href="/blog/clean-reusable-shop-vacuum-bag/"
              className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
              data-testid="link-clean-bag"
            >
              how to clean a reusable shop vacuum bag
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─────────────────── SECTION 7 — FAQ (schema-backed) ─────────────────── */}
      <section
        id="faq"
        data-testid="section-faq"
        className="bg-cream py-16 sm:py-20 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-bangers text-sm tracking-[0.3em] text-muk uppercase mb-4">
            07 · Questions
          </p>
          <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-ink">
            Questions contractors ask.
          </h2>

          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqRow key={i} item={item} testId={`faq-row-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── CLOSING CTA ─────────────────── */}
      <section
        id="closing-cta"
        data-testid="section-closing-cta"
        className="bg-ink text-cream py-20 sm:py-28 border-b-4 border-ink"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bowlby text-4xl sm:text-5xl lg:text-6xl leading-[1.02]">
            One bag. <span className="text-slime">Stop buying the rest.</span>
          </h2>
          <a
            href={appendAttribution(CHECKOUT_URL)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="closing-order-btn"
            className="sticker-btn mt-10 inline-flex items-center justify-center gap-3 bg-slime text-ink font-bangers text-2xl sm:text-3xl uppercase tracking-wider px-10 py-5 border-4 border-cream rounded-sm shadow-brutal"
          >
            Order Muk Buddy — $99
            <ArrowRight className="w-6 h-6" strokeWidth={2.75} />
          </a>
          <p className="mt-5 text-sm text-cream/80 font-mono">
            Patent Pending · Made in the USA · Secure checkout via The Floor Lord
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─────────────────────────── FAQ Row ─────────────────────────── */
function FaqRow({ item, testId }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      data-testid={testId}
      className="border-4 border-ink bg-white shadow-brutal-sm overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cream transition-colors"
      >
        <span className="font-bowlby text-lg sm:text-xl text-ink leading-snug">
          {item.q}
        </span>
        <ChevronDown
          className={[
            "w-5 h-5 text-muk flex-shrink-0 transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-ink/85 text-base leading-relaxed">
          <p>{item.a}</p>
          {item.link && (
            <p className="mt-3 text-sm">
              See:{" "}
              <a
                href={item.link.href}
                className="underline decoration-muk decoration-2 hover:text-muk font-semibold"
              >
                {item.link.label}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
