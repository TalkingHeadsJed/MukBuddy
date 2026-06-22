import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, Mail, Calendar } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { ORDER_URL } from "@/lib/constants";
import HeadlinePeek from "@/components/sections/HeadlinePeek";
import PageHead from "@/components/PageHead";

/**
 * Thank-you page after a successful lead submission.
 *
 * URL: /thank-you  (also accepts /thank-you?lead_id=... for attribution).
 *
 * 🎯 CONVERSION PIXEL INJECTION POINTS
 *
 * This is THE page where ad platforms (Google Ads, Meta, LinkedIn, Reddit, TikTok)
 * fire conversion events. Pixels can be added in two ways:
 *
 *   A) In `public/index.html` — best for site-wide pixels (Meta base pixel, GA4).
 *   B) Inside this component, in the `fireConversionPixels()` block below —
 *      best for conversion EVENTS that should ONLY fire on this page.
 *
 * Always keep:
 *   • <meta name="robots" content="noindex"> at the top — done in useEffect
 *   • The URL stable as "/thank-you" — ad platforms key on this exact path
 */
export default function ThankYou() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const leadId = params.get("lead_id");

  useEffect(() => {
    // Helmet (via <PageHead/>) handles title + noindex meta for both
    // prerendered HTML and SPA navigation, so no manual DOM edits needed
    // here — just fire the conversion pixels.
    fireConversionPixels({ leadId });
  }, [leadId]);

  return (
    <main
      data-testid="thank-you-page"
      className="relative min-h-screen bg-cream text-ink overflow-hidden"
    >
      <PageHead
        title="Thank You — Muk Buddy"
        description="Thanks — we got your message. We'll be in touch with crew pricing shortly."
        canonical="https://mukbuddy.com/thank-you"
        robots="noindex, nofollow"
      />
      <div className="absolute inset-0 halftone-cream opacity-90" aria-hidden />
      <div className="slime-drip-muk absolute top-0 inset-x-0" aria-hidden />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <HeadlinePeek
          variant="tilt1"
          rotate={-8}
          size="h-44 lg:h-56"
          className="top-12 right-2 lg:top-8 lg:right-0"
          testId="peek-thanks"
        />

        {/* Stamp */}
        <div
          data-testid="thank-you-stamp"
          className="inline-flex items-center gap-2 bg-slime border-4 border-ink px-4 py-2 rotate-[-2deg] shadow-brutal-sm"
        >
          <Check className="w-5 h-5 text-ink" strokeWidth={3} />
          <span className="font-bangers text-base uppercase tracking-[0.25em] text-ink">
            Message Sent
          </span>
        </div>

        <h1
          data-testid="thank-you-headline"
          className="font-bowlby text-5xl sm:text-7xl lg:text-[5.5rem] mt-6 leading-[0.95] text-ink max-w-3xl"
        >
          Got it. <br />
          <span className="text-muk">We'll be in touch.</span>
        </h1>

        <p
          data-testid="thank-you-sub"
          className="mt-6 font-paytone text-2xl sm:text-3xl text-ink/80 leading-tight max-w-2xl"
        >
          A real human reads every message —{" "}
          <span className="hl-yellow">usually back within 24 hours.</span>
        </p>

        {/* What happens next */}
        <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-white border-2 border-ink p-5 shadow-brutal-sm">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-muk" />
              <span className="font-bangers text-sm uppercase tracking-[0.2em] text-ink/70">
                Step 1
              </span>
            </div>
            <p className="font-anton text-xl text-ink leading-tight">
              Check your inbox for a confirmation copy.
            </p>
          </div>
          <div className="bg-white border-2 border-ink p-5 shadow-brutal-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-muk" />
              <span className="font-bangers text-sm uppercase tracking-[0.2em] text-ink/70">
                Step 2
              </span>
            </div>
            <p className="font-anton text-xl text-ink leading-tight">
              We respond personally within one business day.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="thank-you-order-cta"
            className="sticker-btn inline-flex items-center gap-3 bg-slime text-ink font-bangers text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 border-4 border-ink rounded-sm shadow-brutal whitespace-nowrap"
          >
            Order Muk Buddy
            <ArrowRight className="w-5 h-5" />
          </a>
          <button
            onClick={() => navigate("/")}
            data-testid="thank-you-home-cta"
            className="inline-flex items-center gap-2 bg-transparent text-ink font-bangers text-lg uppercase tracking-wider px-5 py-3 border-2 border-ink/30 hover:border-ink transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        {leadId && (
          <p
            data-testid="thank-you-reference"
            className="mt-10 font-mono text-[10px] text-ink/40 tracking-wider"
          >
            // reference: {leadId}
          </p>
        )}
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * 🎯 CONVERSION PIXELS — drop your snippets here.
 *
 * This runs EXACTLY once when the /thank-you page loads after a
 * successful lead submission. Safe to use window.fbq, gtag, etc.
 *
 * Examples (uncomment + paste your IDs when you set up the ads):
 *
 *   // Google Ads conversion
 *   if (window.gtag) {
 *     window.gtag('event', 'conversion', {
 *       send_to: 'AW-XXXXXXXXX/YYYYYYYY',
 *       value: 0,
 *       currency: 'USD',
 *       transaction_id: leadId || '',
 *     });
 *   }
 *
 *   // Meta (Facebook) Pixel
 *   if (window.fbq) {
 *     window.fbq('track', 'Lead', { content_name: 'Lead Form' });
 *   }
 *
 *   // LinkedIn Insight Tag — single-conversion track
 *   if (window.lintrk) {
 *     window.lintrk('track', { conversion_id: 1234567 });
 *   }
 *
 *   // Reddit Pixel
 *   if (window.rdt) window.rdt('track', 'Lead');
 *
 *   // TikTok Pixel
 *   if (window.ttq) window.ttq.track('SubmitForm');
 *
 *   // GA4 event (alternative to URL-based goal)
 *   if (window.gtag) window.gtag('event', 'generate_lead');
 *
 * ─────────────────────────────────────────────────────────────── */
function fireConversionPixels(/* { leadId } */) {
  // Meta Pixel — fire PageView for the SPA route nav into /thank-you.
  // (Base pixel + initial PageView load from public/index.html on first
  // page load; this catches client-side navigations after form submit.)
  // The `Lead` conversion event is fired at the moment of submit in
  // LeadForm.jsx and AdsLanding.jsx, so we deliberately do NOT fire it
  // again here — avoids double-counting in Meta Ads Manager.
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
}
