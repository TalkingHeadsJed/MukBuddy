import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DollarSign,
  Gauge,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Star,
  Truck,
  RotateCcw,
  Award,
  Lock,
  Users,
  ChevronDown,
  Play,
} from "lucide-react";
import { API, buildAddToCartUrl, VIMEO_EMBED } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

/* ──────────────────────────────────────────────────────────────────────────
   Muk Buddy — Meta Ads Landing Page (v2 — aggressive DR / assumptive close)
   Route: /ads
   Style: Trade-pro (navy/steel + safety red, no mascot)
   DR principles used:
     • Assumptive close (qualifier widget — "how many?" not "if any?")
     • Anchoring (annual disposable cost vs Muk Buddy total)
     • Loss aversion ("you're burning $X/yr")
     • Social proof (testimonials, crew counts, star ratings)
     • Authority (patented, real numbers)
     • Risk reversal (30-day return, free shipping, secure checkout)
     • Commitment/consistency (multi-step qualifier → form)
     • Scarcity-light (without fake claims — "crew pricing available")
   ────────────────────────────────────────────────────────────────────────── */

// Annual disposable bag spend per machine (field data, conservative).
const SPEND_PER_MACHINE_PER_YEAR = 1000;

const QUANTITY_OPTIONS = [
  { id: 1, label: "1 vac", helper: "Solo or owner-op", machines: 1 },
  { id: 3, label: "2–4 vacs", helper: "Small crew", machines: 3 },
  { id: 7, label: "5–10 vacs", helper: "Multi-crew", machines: 7 },
  { id: 12, label: "10+ vacs", helper: "Fleet / GC", machines: 12 },
];

export default function AdsLanding() {
  // noindex + canonical
  useEffect(() => {
    document.title =
      "Muk Buddy — Reusable Shop Vac Bag · Stop the Bag Tax | Order Today";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://mukbuddy.com/";
    document.head.appendChild(canonical);
    return () => {
      document.head.removeChild(robots);
      document.head.removeChild(canonical);
    };
  }, []);

  // Meta Pixel — base script lives in index.html (site-wide).
  // Here we just fire PageView on SPA route mount so client-side
  // navigations into /ads also register as a view in Meta.
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, []);

  // Lifted state — qualifier selection drives savings calc, CTAs, and form
  const [vacQuantity, setVacQuantity] = useState(null);

  // Capture Meta-ads UTM/tracking params on landing so they flow through
  // to the WooCommerce add-to-cart URL for attribution. Lazy init = run once.
  const [utmSuffix] = useState(() => {
    if (typeof window === "undefined") return "";
    const search = new URLSearchParams(window.location.search);
    const keep = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
    ];
    const parts = [];
    for (const k of keep) {
      const v = search.get(k);
      if (v) parts.push(`${k}=${encodeURIComponent(v)}`);
    }
    return parts.join("&");
  });

  const formRef = useRef(null);
  const savingsRef = useRef(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToSavings = () => {
    savingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      data-testid="ads-landing"
      className="bg-white text-slate-900 antialiased pb-20 sm:pb-0"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <AdsHeader scrollToForm={scrollToForm} utmSuffix={utmSuffix} />
      <TrustStrip />
      <Hero scrollToSavings={scrollToSavings} utmSuffix={utmSuffix} />
      <AirflowDemo />
      <Benefits utmSuffix={utmSuffix} />
      <SavingsCalc
        savingsRef={savingsRef}
        vacQuantity={vacQuantity}
        setVacQuantity={setVacQuantity}
        utmSuffix={utmSuffix}
      />
      <ComparisonTable />
      <SocialProof />
      <GuaranteeBar />
      <LeadFormSection formRef={formRef} vacQuantity={vacQuantity} />
      <FAQ />
      <FinalCTA vacQuantity={vacQuantity} utmSuffix={utmSuffix} />
      <Footer />
      <StickyMobileCTA scrollToForm={scrollToForm} utmSuffix={utmSuffix} />
    </main>
  );
}

/* ─────────────────────────────── Header ─────────────────────────────── */
function AdsHeader({ scrollToForm, utmSuffix }) {
  return (
    <header
      data-testid="ads-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="/ads"
          data-testid="ads-wordmark"
          className="text-slate-900 font-bold tracking-tight text-lg sm:text-xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          MUK<span className="text-red-600">·</span>BUDDY
        </a>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={scrollToForm}
            data-testid="ads-header-info-btn"
            className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Crew pricing
          </button>
          <a
            href={buildAddToCartUrl(1, utmSuffix)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="ads-header-order-btn"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            Order
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────── Tiny trust strip (authority + social proof) ────────────────── */
function TrustStrip() {
  return (
    <div
      data-testid="ads-trust-strip"
      className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-red-500" /> US Patented design
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-red-500" /> Free US shipping
        </span>
        <span className="inline-flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-red-500" /> 30-day return
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-red-500" /> Secure checkout
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Hero ─────────────────────────────── */
function Hero({ scrollToSavings, utmSuffix }) {
  const [videoOpen, setVideoOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    if (!videoOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setVideoOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [videoOpen]);

  return (
    <section
      data-testid="ads-hero"
      className="relative bg-slate-950 overflow-hidden"
    >
      {/* Edge-to-edge 50/50 split. Uses more of the fold. */}
      <div className="relative grid lg:grid-cols-2 lg:min-h-[720px] lg:max-h-[820px]">
        {/* ═══════════════════ LEFT: BAG PILE + HEADLINE (NO DARK CARD) ═══════════════════ */}
        <div
          className="relative overflow-hidden order-2 lg:order-1 min-h-[540px] lg:min-h-0 flex flex-col"
          data-testid="ads-hero-disposable"
        >
          {/* Full-bleed pile of bags — fully visible, no scrim across the photo */}
          <img
            src={IMAGES.bagPileMountain}
            alt="A mountain of disposable shop vac bags — the bag tax contractors pay every week."
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />

          {/* "DISPOSABLE · THE BAG TAX" stamp at top */}
          <div className="absolute top-5 left-5 sm:top-6 sm:left-8 z-10">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 shadow-2xl">
              <X className="w-3.5 h-3.5" strokeWidth={3} />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                Disposable · The bag tax
              </span>
            </div>
          </div>

          {/* HEADLINE — direct on photo, strong text shadow for legibility */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 lg:p-14 pb-10 sm:pb-14 lg:pb-16">
            <h1
              className="font-bold leading-[0.85] tracking-tight"
              style={{
                letterSpacing: "-0.045em",
                textShadow:
                  "0 6px 32px rgba(0,0,0,0.85), 0 3px 10px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,1)",
              }}
            >
              <span
                className="block text-red-500 text-[8rem] sm:text-[12rem] lg:text-[14rem] xl:text-[17rem] leading-[0.78]"
                style={{
                  fontWeight: 900,
                  letterSpacing: "-0.075em",
                  WebkitTextStroke: "3px #ef4444",
                }}
              >
                STOP
              </span>
              <span className="block text-white text-3xl sm:text-5xl lg:text-5xl xl:text-6xl mt-3 sm:mt-4 font-bold">
                using disposable bags
              </span>
            </h1>
          </div>
        </div>

        {/* ═══════════════════ RIGHT: MUK BUDDY PRODUCT + HEADLINE (LIGHT BG) ═══════════════════ */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 order-1 lg:order-2 min-h-[540px] lg:min-h-0 flex flex-col"
          data-testid="ads-hero-mukbuddy"
        >
          {/* Subtle radial spotlight behind product */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 60% 35%, rgba(255,255,255,1) 0%, rgba(226,232,240,0.4) 55%, rgba(203,213,225,0) 100%)",
            }}
          />
          {/* Light technical grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* "Reusable · Forever" stamp at top */}
          <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-10">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 shadow-xl">
              <Check className="w-3.5 h-3.5 text-red-500" strokeWidth={4} />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                Reusable · Forever
              </span>
            </div>
          </div>

          {/* Layout: product on upper-left, headline + CTAs on the right/bottom */}
          <div className="relative z-[1] flex-1 grid grid-rows-[1fr_auto] sm:grid-cols-[1fr_1.05fr] lg:grid-cols-[1fr_1.1fr] items-center px-6 sm:px-8 lg:px-10 pt-14 sm:pt-16 pb-8 gap-4 sm:gap-6">
            {/* Muk Buddy product image */}
            <div className="flex items-center justify-center sm:justify-end">
              <img
                src={IMAGES.productStraight}
                alt="Muk Buddy — the patented reusable wet/dry vacuum bag"
                className="w-[60%] sm:w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px] h-auto object-contain drop-shadow-[0_30px_45px_rgba(15,23,42,0.35)]"
                loading="eager"
                data-testid="ads-hero-product-image"
              />
            </div>

            {/* Right-side LARGE TEXT + CTAs */}
            <div className="space-y-5 sm:space-y-6 text-center sm:text-left">
              <h2
                className="font-bold leading-[0.9] tracking-tight text-slate-900"
                style={{ letterSpacing: "-0.035em" }}
              >
                <span className="block text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Get the
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="text-red-600">REUSABLE</span>
                  <br />
                  vac bag.
                </span>
              </h2>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1 justify-center sm:justify-start">
                <a
                  href={buildAddToCartUrl(1, utmSuffix)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="ads-hero-order-btn"
                  className="relative inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base sm:text-lg px-7 sm:px-8 py-4 sm:py-4 transition-all uppercase tracking-wider shadow-2xl ring-4 ring-red-600/30 hover:ring-red-600/60 hover:scale-[1.02]"
                >
                  Order Muk Buddy
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </a>
                <button
                  type="button"
                  onClick={scrollToSavings}
                  data-testid="ads-hero-savings-btn"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-300 hover:border-slate-900 text-slate-900 font-semibold text-sm px-5 py-3.5 transition-colors"
                >
                  See my savings
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                  ))}
                  <span className="ml-1 font-bold text-slate-900">4.9 / 5</span>
                </span>
                <span className="text-slate-400">·</span>
                <span>Free US shipping · 30-day return</span>
              </div>
            </div>
          </div>

          {/* "Replaces 100s of disposables" badge — bottom-left */}
          <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-8 bg-red-600 text-white px-3.5 py-2.5 shadow-2xl z-10">
            <p className="text-[9px] uppercase tracking-[0.18em] text-red-100 font-bold">
              Replaces
            </p>
            <p className="text-base font-bold leading-tight mt-0.5">
              100s of disposables
            </p>
          </div>
        </div>

        {/* Center stack: PLAY VIDEO button + arrow below. Visible on all sizes. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            data-testid="ads-hero-play-video-btn"
            className="group inline-flex items-center gap-2.5 sm:gap-3 bg-white text-slate-900 font-bold text-sm sm:text-base px-5 sm:px-7 py-3 sm:py-4 shadow-2xl ring-4 ring-white/30 hover:ring-red-600/50 hover:bg-red-600 hover:text-white transition-all uppercase tracking-[0.15em] hover:scale-105"
            aria-label="Play product video"
          >
            <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-full group-hover:bg-white transition-colors">
              <Play
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-red-600 fill-current ml-0.5"
                strokeWidth={2}
              />
            </span>
            Play Video
          </button>

          {/* Arrow — only on lg+ */}
          <div className="hidden lg:flex pointer-events-none">
            <div className="bg-red-600 text-white w-12 h-12 flex items-center justify-center shadow-2xl rounded-full border-[3px] border-white">
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ VIDEO MODAL ═══════════════════ */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
          onClick={() => setVideoOpen(false)}
          data-testid="ads-hero-video-modal"
        >
          <button
            type="button"
            onClick={() => setVideoOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-12 h-12 flex items-center justify-center bg-white text-slate-900 hover:bg-red-600 hover:text-white shadow-2xl transition-colors"
            aria-label="Close video"
            data-testid="ads-hero-video-close-btn"
          >
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${VIMEO_EMBED}&autoplay=1`}
              title="Muk Buddy product video"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────── Airflow demo (webm video, 2nd fold) ────────────────────── */
function AirflowDemo() {
  return (
    <section
      data-testid="ads-airflow-demo"
      className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden"
    >
      {/* Subtle technical-grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              How it works
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              The patented 2-chamber airflow.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Air pulls debris into the outer chamber, where heavier dust and
              fines drop out before they ever touch your filter. Only clean air
              continues through to the motor. That&apos;s why your suction stays
              strong and your motor runs cool.
            </p>
            <ul className="space-y-2 pt-2 text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Outer chamber</strong> traps
                  heavy debris and fines
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Inner chamber</strong>{" "}
                  delivers clean airflow to the motor
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Filter stays clean</strong>{" "}
                  load after load
                </span>
              </li>
            </ul>
          </div>

          {/* Video */}
          <div className="lg:col-span-7">
            <div className="relative bg-slate-900 border-2 border-red-600 overflow-hidden aspect-[4/5] sm:aspect-[3/4] max-h-[640px] mx-auto">
              <video
                src={IMAGES.mascotAnimation}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
                data-testid="ads-airflow-video"
                aria-label="Muk Buddy 2-chamber airflow demonstration"
              />
              {/* Corner technical labels */}
              <div className="absolute top-3 left-3 bg-slate-950/90 text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-red-600/40">
                ▶ Live demo · 2-chamber airflow
              </div>
              <div className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                US patented design
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Real-time visualization of how Muk Buddy captures dust before it
              reaches your filter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── 3 Big Benefits ─────────────────────────────── */
function Benefits({ utmSuffix }) {
  const benefits = [
    {
      icon: DollarSign,
      num: "01",
      title: "Save Money.",
      body:
        "Stop the bag tax. Contractors burn ~$1,000/year on disposables for every vac they run. One Muk Buddy replaces years of them.",
      stat: "$1,000+",
      statLabel: "per vac · per year",
    },
    {
      icon: Gauge,
      num: "02",
      title: "Improve Suction.",
      body:
        "The patented 2-chamber design captures dust before it cakes onto your filter. Airflow stays open. Suction stays strong all day.",
      stat: "Full",
      statLabel: "suction · every load",
    },
    {
      icon: ShieldCheck,
      num: "03",
      title: "Increase Motor Life.",
      body:
        "Clogged filters cook your motor. Muk Buddy keeps the airflow path clean — your motor stays cool and stays alive longer.",
      stat: "Cooler",
      statLabel: "running · longer life",
    },
  ];

  return (
    <section
      data-testid="ads-benefits"
      className="bg-white py-20 sm:py-28 border-y-4 border-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-4">
            Built to do three things
          </p>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[0.95] tracking-tight"
            style={{ letterSpacing: "-0.035em" }}
          >
            Why every crew is{" "}
            <span className="text-red-600">switching.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.num}
                data-testid={`ads-benefit-${b.num}`}
                className="group relative bg-slate-950 text-white p-8 sm:p-10 lg:p-12 overflow-hidden transition-all hover:bg-red-600 cursor-default"
              >
                {/* Giant number watermark */}
                <span
                  aria-hidden="true"
                  className="absolute -top-6 -right-4 text-[10rem] sm:text-[12rem] font-bold text-white/[0.06] leading-none select-none tracking-tighter"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  {b.num}
                </span>

                {/* Icon */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-red-600 group-hover:bg-slate-950 flex items-center justify-center mb-8 transition-colors">
                  <Icon
                    className="w-9 h-9 sm:w-11 sm:h-11 text-white"
                    strokeWidth={2.25}
                  />
                </div>

                {/* HUGE headline */}
                <h3
                  className="relative text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[0.95] mb-5 tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {b.title}
                </h3>

                {/* Body */}
                <p className="relative text-base sm:text-lg text-slate-300 group-hover:text-red-50 leading-relaxed mb-8 transition-colors">
                  {b.body}
                </p>

                {/* Stat strip at bottom */}
                <div className="relative pt-6 border-t border-white/15 group-hover:border-white/30 transition-colors">
                  <p className="text-3xl sm:text-4xl font-bold text-red-500 group-hover:text-white leading-none transition-colors tracking-tight">
                    {b.stat}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 group-hover:text-red-100 font-semibold mt-2 transition-colors">
                    {b.statLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big CTA below benefits */}
        <div className="text-center mt-14 sm:mt-20">
          <a
            href={buildAddToCartUrl(1, utmSuffix)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="ads-benefits-order-btn"
            className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xl sm:text-2xl px-10 py-6 transition-all uppercase tracking-wider shadow-2xl ring-4 ring-red-600/20 hover:ring-red-600/40 hover:scale-[1.02]"
          >
            Order Muk Buddy
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
          </a>
          <p className="text-sm text-slate-500 mt-4">
            Free shipping · 30-day return · Patented 2-chamber design
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Savings calc (anchoring + loss aversion) ────────────────────── */
function SavingsCalc({ savingsRef, vacQuantity, setVacQuantity, utmSuffix }) {
  const selected = QUANTITY_OPTIONS.find((q) => q.id === vacQuantity);
  const machines = selected?.machines ?? 3; // default preview = 3 machines

  const annualBagSpend = machines * SPEND_PER_MACHINE_PER_YEAR;
  const fiveYearSpend = annualBagSpend * 5;
  // Conservative: 1 Muk Buddy per machine, $0 ongoing
  const mukBuddyYear1 = machines * 99; // Muk Buddy list price
  const mukBuddy5Year = mukBuddyYear1; // one purchase, no recurring
  const fiveYearSavings = fiveYearSpend - mukBuddy5Year;

  return (
    <section
      ref={savingsRef}
      id="savings"
      data-testid="ads-savings"
      className="bg-slate-900 text-white py-20 sm:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-3">
              The bag tax
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Every week you wait costs you{" "}
              <span className="text-red-500">real money.</span>
            </h2>
            <p className="text-slate-300 mt-5 text-lg leading-relaxed">
              Run the math on your own crew. We&apos;ll show you what disposable
              bags cost over five years vs. one Muk Buddy per machine.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white text-slate-900 border-l-4 border-red-600 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Your crew
              </p>
              {selected ? (
                <button
                  type="button"
                  onClick={() => setVacQuantity(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                  data-testid="ads-savings-reset"
                >
                  Change
                </button>
              ) : null}
            </div>

            {/* If no selection, show inline picker */}
            {!selected && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {QUANTITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVacQuantity(opt.id)}
                    data-testid={`ads-savings-pick-${opt.id}`}
                    className="px-3 py-3 text-left bg-slate-50 border-2 border-slate-300 hover:border-slate-900 transition-colors"
                  >
                    <div className="font-bold text-sm leading-tight">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {opt.helper}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <p className="text-2xl font-bold text-slate-900 mb-6">
              {machines} {machines === 1 ? "machine" : "machines"} running
            </p>

            <div className="space-y-1">
              <Row
                label="Disposable bags — 1 year"
                value={`$${annualBagSpend.toLocaleString()}`}
                tone="bad"
              />
              <Row
                label="Disposable bags — 5 years"
                value={`$${fiveYearSpend.toLocaleString()}`}
                tone="bad"
              />
              <Row
                label="Muk Buddy — total (5 years)"
                value={`$${mukBuddy5Year.toLocaleString()}`}
                tone="good"
              />
            </div>

            <div className="mt-5 pt-5 border-t-2 border-slate-900 flex items-baseline justify-between">
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-700">
                5-year savings
              </span>
              <span
                data-testid="ads-savings-total"
                className="text-3xl sm:text-4xl font-bold text-red-600"
              >
                ${fiveYearSavings.toLocaleString()}
              </span>
            </div>

            <a
              href={buildAddToCartUrl(machines, utmSuffix)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="ads-savings-order-btn"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-5 py-4 transition-colors uppercase tracking-wide"
            >
              Equip my {machines === 1 ? "vac" : `${machines} vacs`} now
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              Estimate based on field data: avg crew burns ~$1,000 / vac / year on
              disposable bags. Muk Buddy at $99 / vac, one-time, no replacement
              filters required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, tone }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-slate-200 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span
        className={[
          "text-lg font-bold tabular-nums",
          tone === "bad" && "text-slate-900 line-through decoration-red-500/40 decoration-2",
          tone === "good" && "text-slate-900",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────── Comparison table (loss aversion) ────────────────────── */
function ComparisonTable() {
  const rows = [
    { label: "Reusable", mb: true, disp: false },
    { label: "Stronger suction over time", mb: true, disp: false },
    { label: "Protects motor", mb: true, disp: false },
    { label: "Wet & dry capable", mb: true, disp: "Some" },
    { label: "Recurring weekly cost", mb: false, disp: true },
    { label: "Generates landfill waste", mb: false, disp: true },
  ];
  return (
    <section
      data-testid="ads-comparison"
      className="bg-white py-20 sm:py-24 border-b border-slate-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            Head to head
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Muk Buddy vs. Disposable Bags
          </h2>
        </div>
        <div className="overflow-hidden border-2 border-slate-900">
          <div className="grid grid-cols-3 bg-slate-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
            <div className="px-4 py-4">Feature</div>
            <div className="px-4 py-4 text-center bg-red-600">Muk Buddy</div>
            <div className="px-4 py-4 text-center">Disposable Bags</div>
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 border-t border-slate-200 bg-white"
            >
              <div className="px-4 py-4 text-sm sm:text-base text-slate-700 font-medium">
                {row.label}
              </div>
              <div className="px-4 py-4 text-center bg-red-50/40">
                {row.mb === true ? (
                  <Check className="w-5 h-5 text-red-600 inline-block" />
                ) : (
                  <X className="w-5 h-5 text-slate-400 inline-block" />
                )}
              </div>
              <div className="px-4 py-4 text-center">
                {row.disp === true ? (
                  <Check className="w-5 h-5 text-slate-400 inline-block" />
                ) : row.disp === false ? (
                  <X className="w-5 h-5 text-slate-400 inline-block" />
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    {row.disp}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Social Proof (3 quotes) ─────────────────────────── */
function SocialProof() {
  const quotes = [
    {
      img: IMAGES.portrait1,
      name: "Mike R.",
      role: "Siding contractor",
      quote:
        "Stopped buying bags six months ago. Suction's better than when the vac was new.",
    },
    {
      img: IMAGES.portrait2,
      name: "Carlos D.",
      role: "Drywall crew (4 vacs)",
      quote:
        "We were dropping $80/week on bags across the trucks. Muk Buddy paid back in a month.",
    },
    {
      img: IMAGES.portrait4,
      name: "Tom B.",
      role: "Renovation GC",
      quote:
        "Outlasted three filters and one shop vac so far. Just keeps working.",
    },
  ];
  return (
    <section
      data-testid="ads-social-proof"
      className="bg-slate-50 py-20 sm:py-24 border-y border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center gap-1 mb-3 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
            ))}
            <span className="ml-2 text-sm font-bold text-slate-900">
              4.9 / 5
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Real crews. Real results.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <figure
              key={q.name}
              data-testid={`ads-testimonial-${q.name}`}
              className="bg-white border border-slate-200 p-6 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                ))}
              </div>
              <blockquote className="text-slate-700 leading-relaxed flex-1">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 pt-5 border-t border-slate-200 flex items-center gap-3">
                <img
                  src={q.img}
                  alt={q.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{q.name}</p>
                  <p className="text-xs text-slate-500">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Guarantee bar (risk reversal) ─────────────────── */
function GuaranteeBar() {
  const items = [
    {
      icon: RotateCcw,
      title: "30-day return",
      body: "Not for you? Send it back. No restock fee.",
    },
    {
      icon: Truck,
      title: "Free US shipping",
      body: "Ships from US. No surprise fees at checkout.",
    },
    {
      icon: Award,
      title: "US patented",
      body: "Real engineering, not a knockoff filter sock.",
    },
    {
      icon: Lock,
      title: "Secure checkout",
      body: "256-bit SSL via TheFloorLord. Cards & PayPal.",
    },
  ];
  return (
    <section
      data-testid="ads-guarantee"
      className="bg-white py-12 sm:py-16 border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-red-50 border border-red-600/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────── Lead Form ─────────────────────────────── */
function LeadFormSection({ formRef, vacQuantity }) {
  const navigate = useNavigate();
  const selected = QUANTITY_OPTIONS.find((q) => q.id === vacQuantity);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    crew_count: "",
    machine_count: selected?.machines?.toString() ?? "",
    mb_meta: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2)
      return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email.";
    const phone = form.phone.trim();
    if (phone && !/^[0-9+\-\s().]{7,20}$/.test(phone))
      return "Please enter a valid phone number (digits only, 7\u201320 characters).";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      // Encode crew + machine count into existing fields so we don't change the API contract
      const crewSizeStr = [
        form.machine_count ? `${form.machine_count} machines` : null,
        form.crew_count ? `${form.crew_count} crews` : null,
      ]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 40);
      const messageStr = `Meta ad LP lead — ${
        form.machine_count || "?"
      } machines, ${form.crew_count || "?"} crews. Wants crew pricing.`;
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        crew_size: crewSizeStr || null,
        message: messageStr,
        mb_meta: form.mb_meta || null,
      };
      const { data } = await axios.post(`${API}/leads`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });
      if (typeof window !== "undefined" && window.fbq) {
        // Pass estimated lead value so Meta's algorithm can bid harder
        // for high-machine-count crews. $99/unit × machines picked in qualifier.
        const machines = parseInt(form.machine_count, 10) || 1;
        const leadValue = machines * 99;
        window.fbq("track", "Lead", {
          value: leadValue,
          currency: "USD",
          content_name: "Ads LP Lead Form",
          num_items: machines,
        });
      }
      const leadId = data?.id ? `?lead_id=${encodeURIComponent(data.id)}` : "";
      navigate(`/thank-you${leadId}`);
    } catch (e2) {
      const msg =
        e2?.response?.status === 429
          ? "Too many requests. Try again in a minute."
          : "Couldn't send right now. Try again shortly.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={formRef}
      id="get-info"
      data-testid="ads-lead-form-section"
      className="bg-slate-50 py-20 sm:py-24 border-b border-slate-200"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            Step 2 · Crew pricing
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Get your crew set up.
          </h2>
          <p className="text-slate-600 mt-4 max-w-xl mx-auto">
            Tell us what you run and we&apos;ll come back with crew pricing within
            one business day. A real human replies — no call center, no spam.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          data-testid="ads-lead-form"
          className="bg-white border border-slate-200 p-6 sm:p-10 space-y-5"
          noValidate
        >
          {/* honeypot */}
          <input
            type="text"
            name="mb_meta"
            value={form.mb_meta}
            onChange={onChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: "1px",
              height: "1px",
            }}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <AdsField label="Name" required>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                maxLength={80}
                required
                data-testid="ads-lead-name"
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 outline-none focus:border-red-600 transition-colors"
              />
            </AdsField>
            <AdsField label="Email" required>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                maxLength={120}
                required
                data-testid="ads-lead-email"
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 outline-none focus:border-red-600 transition-colors"
              />
            </AdsField>
            <AdsField label="Phone (optional)">
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                maxLength={25}
                data-testid="ads-lead-phone"
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 outline-none focus:border-red-600 transition-colors"
              />
            </AdsField>
            <AdsField label="How many crews?">
              <select
                name="crew_count"
                value={form.crew_count}
                onChange={onChange}
                data-testid="ads-lead-crew-count"
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 outline-none focus:border-red-600 transition-colors"
              >
                <option value="">Select</option>
                <option value="1">1 crew</option>
                <option value="2-4">2–4 crews</option>
                <option value="5-9">5–9 crews</option>
                <option value="10+">10+ crews</option>
              </select>
            </AdsField>
          </div>

          <AdsField label="How many wet/dry vacs?">
            <select
              name="machine_count"
              value={form.machine_count}
              onChange={onChange}
              data-testid="ads-lead-machine-count"
              className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 outline-none focus:border-red-600 transition-colors"
            >
              <option value="">Select</option>
              <option value="1">1 machine</option>
              <option value="3">2–4 machines</option>
              <option value="7">5–10 machines</option>
              <option value="12">10+ machines</option>
            </select>
          </AdsField>

          <button
            type="submit"
            disabled={submitting}
            data-testid="ads-lead-submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base px-6 py-4 transition-colors uppercase tracking-wide"
          >
            {submitting ? "Sending…" : "Send me crew pricing"}
            {!submitting && <ArrowRight className="w-5 h-5" />}
          </button>

          <p className="text-[11px] text-slate-500 text-center pt-1 leading-relaxed">
            By submitting, you agree to be contacted about Muk Buddy. We never
            share your info. One business day reply, guaranteed.
          </p>
        </form>
      </div>
    </section>
  );
}

function AdsField({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-widest text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

/* ─────────────────────────────── FAQ (objection handling) ─────────────────────────────── */
function FAQ() {
  const items = [
    {
      q: "Will it fit my vacuum?",
      a: "Muk Buddy fits 12–20 gallon wet/dry vacs from Shop-Vac, Ridgid, Craftsman, Stanley, and most DeWalt models. Not sure about yours? Send us your model number and we'll confirm in one business day.",
    },
    {
      q: "Is it actually reusable?",
      a: "Yes. After each job: empty it outside, rinse if needed, let it dry, reload. The fabric is industrial — most crews report 2+ years of daily use on a single Muk Buddy.",
    },
    {
      q: "Can I use it for wet pickup?",
      a: "Yes. The 2-chamber design separates liquids from fines. Drain it after wet jobs and you're ready for dry on the next one. No swapping filters mid-job.",
    },
    {
      q: "What if I don't like it?",
      a: "30-day no-questions-asked return. If it doesn't pay for itself in the first month, send it back and we refund the order in full.",
    },
  ];
  return (
    <section
      data-testid="ads-faq"
      className="bg-white py-20 sm:py-24 border-b border-slate-200"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            Common questions
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Before you order.
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <FaqRow key={i} q={item.q} a={item.a} testid={`ads-faq-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqRow({ q, a, testid }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      data-testid={testid}
      className="border border-slate-200 bg-slate-50 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white transition-colors"
      >
        <span className="font-bold text-slate-900 text-base sm:text-lg">
          {q}
        </span>
        <ChevronDown
          className={[
            "w-5 h-5 text-slate-500 flex-shrink-0 transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-slate-600 text-[15px] leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── Final CTA ─────────────────────────────── */
function FinalCTA({ vacQuantity, utmSuffix }) {
  const selected = QUANTITY_OPTIONS.find((q) => q.id === vacQuantity);
  const machines = selected?.machines;
  return (
    <section data-testid="ads-final-cta" className="bg-slate-900 text-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          Stop paying the bag tax.{" "}
          <span className="text-red-500">Today.</span>
        </h2>
        <p className="text-lg text-slate-300 mt-5 max-w-xl mx-auto">
          One reusable bag per vac. Stronger suction. Longer motor life. Free
          shipping. 30 days to send it back if it doesn&apos;t pay for itself.
        </p>
        <a
          href={buildAddToCartUrl(machines || 1, utmSuffix)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="ads-final-order-btn"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-5 mt-8 transition-colors uppercase tracking-wide"
        >
          {machines
            ? `Equip my ${machines === 1 ? "vac" : `${machines} vacs`}`
            : "Order Muk Buddy"}
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="text-xs text-slate-400 mt-4">
          Most crews order one per machine. Bulk pricing for 5+ — ask.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Footer ─────────────────────────────── */
function Footer() {
  return (
    <footer
      data-testid="ads-footer"
      className="bg-slate-950 text-slate-400 py-10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-bold text-white tracking-tight">
          MUK<span className="text-red-600">·</span>BUDDY
        </p>
        <p className="text-xs">
          © {new Date().getFullYear()} Muk Buddy · Patented 2-chamber reusable
          wet/dry vac bag
        </p>
      </div>
    </footer>
  );
}

/* ──────────────────── Sticky Mobile Bottom CTA Bar ──────────────────── */
function StickyMobileCTA({ scrollToForm, utmSuffix }) {
  return (
    <div
      data-testid="ads-sticky-cta"
      className="fixed bottom-0 inset-x-0 z-50 bg-slate-900 border-t-2 border-red-600 px-4 py-3 flex items-center gap-2 sm:hidden shadow-2xl"
    >
      <button
        type="button"
        onClick={scrollToForm}
        data-testid="ads-sticky-info-btn"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white text-slate-900 font-semibold text-sm px-3 py-3 border border-white"
      >
        Crew pricing
      </button>
      <a
        href={buildAddToCartUrl(1, utmSuffix)}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="ads-sticky-order-btn"
        className="flex-[1.3] inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider px-3 py-3"
      >
        Order now
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
