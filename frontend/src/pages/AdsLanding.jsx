import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DollarSign,
  Gauge,
  ShieldCheck,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import { API, ORDER_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

/* ──────────────────────────────────────────────────────────────────────────
   Muk Buddy — Meta Ads Landing Page
   Route: /ads
   Style: Trade-pro (navy/steel + safety red, no mascot, no cartoon).
   Goals:
     1. Communicate 3 benefits fast (save $, suction, motor life)
     2. Drive to /api/leads (retargeting) AND direct order link
     3. Mobile-first (Meta = mostly mobile)
     4. noindex (don't compete with mukbuddy.com in Google)
   ────────────────────────────────────────────────────────────────────────── */

// PLACEHOLDER — replace with your real Meta Pixel ID when ready.
const META_PIXEL_ID = "YOUR_PIXEL_ID";

export default function AdsLanding() {
  // noindex + canonical → keep ad LP out of Google so it doesn't cannibalize
  // the main page's organic search visibility.
  useEffect(() => {
    document.title = "Muk Buddy — Reusable Shop Vac Bag | Save on Filters";
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

  // Meta Pixel — injected only on this route, only if a real ID is set.
  useEffect(() => {
    if (!META_PIXEL_ID || META_PIXEL_ID === "YOUR_PIXEL_ID") return;
    if (window.fbq) return;
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  const formRef = useRef(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      data-testid="ads-landing"
      className="bg-white text-slate-900 antialiased"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <AdsHeader scrollToForm={scrollToForm} />
      <Hero scrollToForm={scrollToForm} />
      <Benefits />
      <SocialProof />
      <LeadFormSection formRef={formRef} />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ─────────────────────────────── Header ─────────────────────────────── */
function AdsHeader({ scrollToForm }) {
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
            Get info
          </button>
          <a
            href={ORDER_URL}
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

/* ─────────────────────────────── Hero ─────────────────────────────── */
function Hero({ scrollToForm }) {
  return (
    <section
      data-testid="ads-hero"
      className="relative bg-slate-50 border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-600 border border-red-600/30 bg-red-50 px-2.5 py-1">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            Built for working crews
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.05] tracking-tight"
            style={{ letterSpacing: "-0.025em" }}
          >
            The reusable shop vac bag that pays for itself.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
            One Muk Buddy replaces years of disposable bags — keeps suction
            strong and adds life to your wet/dry vac's motor. Fits 16-gallon
            Shop-Vac, Ridgid, Craftsman & Stanley.
          </p>

          {/* Trio of micro-claims */}
          <ul className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              "Cuts bag spend ~$1,000/yr",
              "Stronger suction, longer",
              "Saves your motor",
            ].map((claim) => (
              <li
                key={claim}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <Check className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{claim}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a
              href={ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="ads-hero-order-btn"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-base px-6 py-3.5 transition-colors"
            >
              Order Muk Buddy
              <ArrowRight className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={scrollToForm}
              data-testid="ads-hero-info-btn"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 font-semibold text-base px-6 py-3.5 transition-colors"
            >
              Get crew pricing
            </button>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            Free shipping on continental US orders · 30-day return
          </p>
        </div>

        {/* Right: product image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden p-8 sm:p-12">
            <img
              src={IMAGES.productStraight}
              alt="Muk Buddy reusable wet/dry vacuum filter bag"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="eager"
              data-testid="ads-hero-product-image"
            />
          </div>
          {/* Floating spec badge */}
          <div className="absolute -bottom-3 -left-3 sm:-left-6 bg-slate-900 text-white px-4 py-3 shadow-lg">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              Patented
            </p>
            <p className="text-sm font-bold">2-Chamber Design</p>
          </div>
          <div className="absolute -top-3 -right-3 sm:-right-6 bg-red-600 text-white px-4 py-3 shadow-lg">
            <p className="text-[10px] uppercase tracking-widest text-red-100 font-semibold">
              Replaces
            </p>
            <p className="text-sm font-bold">100s of disposables</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── 3 Benefits ─────────────────────────────── */
function Benefits() {
  const benefits = [
    {
      icon: DollarSign,
      kicker: "01",
      title: "Saves money on filters & bags",
      body:
        "Disposable bags run $8–$10 each. A working crew burns through them every week. One Muk Buddy lasts year after year — you stop paying the bag tax.",
      stat: "~$1,000/yr",
      statLabel: "saved per crew",
    },
    {
      icon: Gauge,
      kicker: "02",
      title: "Improves suction performance",
      body:
        "The patented 2-chamber design captures fines before they cake onto your filter. Air keeps moving. Suction stays strong from job one to job five hundred.",
      stat: "Full suction",
      statLabel: "every load",
    },
    {
      icon: ShieldCheck,
      kicker: "03",
      title: "Supports motor life",
      body:
        "Clogged filters force your motor to run hot. Hot motors die early. Muk Buddy keeps the airflow path clean so the motor stays cool — and stays alive longer.",
      stat: "Cooler",
      statLabel: "running motor",
    },
  ];

  return (
    <section
      data-testid="ads-benefits"
      className="bg-white py-20 sm:py-28 border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            What it does
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Three reasons Muk Buddy belongs on every wet/dry vac.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.kicker}
                data-testid={`ads-benefit-${b.kicker}`}
                className="group bg-slate-50 border border-slate-200 p-7 hover:border-slate-900 transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-900 group-hover:bg-red-600 transition-colors flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold tracking-widest text-slate-400">
                    {b.kicker}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                  {b.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-[15px]">
                  {b.body}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-2xl font-bold text-red-600 leading-none">
                    {b.stat}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">
                    {b.statLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Social Proof ─────────────────────────────── */
function SocialProof() {
  return (
    <section
      data-testid="ads-social-proof"
      className="bg-slate-900 text-white py-16 sm:py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 mb-6 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
          ))}
        </div>
        <blockquote
          data-testid="ads-testimonial"
          className="text-xl sm:text-2xl lg:text-3xl font-medium leading-snug text-center text-white tracking-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          "Stopped buying bags six months ago. Suction's better than when the
          vac was new. My motor's still on factory bearings."
        </blockquote>
        <div className="flex items-center gap-4 justify-center mt-8">
          <img
            src={IMAGES.portrait1}
            alt="Contractor testimonial"
            className="w-12 h-12 rounded-full object-cover border-2 border-red-600"
            loading="lazy"
          />
          <div>
            <p className="font-semibold text-white text-sm">
              Mike R. — Siding Contractor
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              6 months on the job
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Lead Form ─────────────────────────────── */
function LeadFormSection({ formRef }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2)
      return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email.";
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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        crew_size: null,
        message: "Meta ad landing page lead — requested info.",
        website: form.website || null,
      };
      const { data } = await axios.post(`${API}/leads`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });
      // Fire Meta Pixel Lead event if Pixel is loaded
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead");
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
      className="bg-slate-50 py-20 sm:py-28 border-b border-slate-200"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            Crew pricing & questions
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Send a question. We'll get back fast.
          </h2>
          <p className="text-slate-600 mt-4 max-w-xl mx-auto">
            Volume orders, vacuum-fit questions, dealer pricing — a real human
            replies. No call center.
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
            name="website"
            value={form.website}
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

          <button
            type="submit"
            disabled={submitting}
            data-testid="ads-lead-submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base px-6 py-4 transition-colors"
          >
            {submitting ? "Sending…" : "Send my question"}
            {!submitting && <ArrowRight className="w-5 h-5" />}
          </button>

          <p className="text-xs text-slate-500 text-center pt-2">
            By submitting, you agree to be contacted about Muk Buddy. We never
            share your info.
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

/* ─────────────────────────────── Final CTA ─────────────────────────────── */
function FinalCTA() {
  return (
    <section
      data-testid="ads-final-cta"
      className="bg-white py-20 sm:py-28"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Stop paying the bag tax.
        </h2>
        <p className="text-lg text-slate-600 mt-5 max-w-xl mx-auto">
          One reusable bag. Stronger suction. Longer motor life. Ship to the
          jobsite today.
        </p>
        <a
          href={ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="ads-final-order-btn"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-8 py-4 mt-8 transition-colors"
        >
          Order Muk Buddy
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="text-xs text-slate-500 mt-4">
          Free shipping · 30-day return · Patented 2-chamber design
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
      className="bg-slate-900 text-slate-400 py-10"
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
