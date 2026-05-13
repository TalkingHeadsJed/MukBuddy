import { X, Check, Flame } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { ORDER_URL } from "@/lib/constants";
import CountUp from "@/components/sections/CountUp";

export default function Problem() {
  return (
    <section
      id="the-problem"
      data-testid="problem-section"
      className="relative bg-cream py-16 sm:py-20 overflow-hidden border-y border-ink/10"
    >
      <div className="absolute inset-0 halftone-cream opacity-90" aria-hidden />
      <div className="slime-drip-muk absolute top-0 inset-x-0" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Overline */}
        <Overline>01 · The Bagless Lie</Overline>

        {/* Headline */}
        <h2
          data-testid="bagless-headline"
          className="font-bowlby text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.0] text-ink max-w-4xl"
        >
          Going bag-less saves money.{" "}
          <span className="text-muk">WRONG!</span> It{" "}
          <span className="text-muk">burns up motors!</span>
        </h2>
        <p className="mt-5 font-paytone text-xl sm:text-2xl text-ink/80 max-w-3xl leading-tight">
          Running bagless feels free —{" "}
          <span className="hl-yellow">
            until your filter clogs and your vac eats itself.
          </span>
        </p>

        {/* The comparison */}
        <div className="mt-12 grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT — Bagless = disaster */}
          <div
            data-testid="bagless-card"
            className="relative bg-ink text-cream border-4 border-ink shadow-brutal overflow-hidden -rotate-1 hover:-rotate-0 transition-transform"
          >
            <div className="absolute top-4 left-4 z-10 bg-muk text-cream font-bangers text-base uppercase tracking-[0.2em] px-3 py-1.5 border-2 border-cream">
              ✕ Bagless = Muk Soup
            </div>
            <div className="absolute top-4 right-4 z-10 bg-cream text-ink font-bangers text-sm uppercase tracking-[0.15em] px-3 py-1.5 border-2 border-ink rotate-3 inline-flex items-center gap-1">
              <Flame className="w-4 h-4" /> Motor Killer
            </div>

            <div className="relative h-72 sm:h-96 overflow-hidden bg-cream">
              <img
                src={IMAGES.problemBagless}
                alt="Real contractor in Carhartt holding a dust-caked, clogged shop-vac filter — what running bagless does to your wet/dry vac filter"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-end gap-3">
                <div
                  data-testid="bagless-filter-cost"
                  className="font-bangers text-3xl sm:text-5xl text-cream leading-[1]"
                >
                  <CountUp to={300} duration={2800} prefix="$" suffix="+" />
                </div>
                <div className="font-mono text-xs text-cream/70 tracking-wider uppercase pb-2">
                  / year in new filters
                </div>
              </div>
              <div
                data-testid="bagless-motor-cost"
                className="font-bangers text-2xl text-cream/90 leading-tight"
              >
                + <CountUp to={200} duration={2800} prefix="$" suffix="+" />{" "}
                <span className="text-muk">new motor</span> when it dies
              </div>
              <div className="font-mono text-[11px] text-cream/60 tracking-wider uppercase">
                // bagless tax · paid in filters, motors, and downtime
              </div>
              <ul className="space-y-2 pt-2 text-cream/90">
                {[
                  "Drywall dust hammers the pleated filter",
                  "Filter clogs in 1–2 jobs",
                  "Dust blasts back into your face",
                  "Suction crashes mid-cut",
                  "Motor overheats → burnout",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 font-bangers text-lg tracking-wider"
                  >
                    <X className="w-5 h-5 text-muk shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — Muk Buddy = filter shield */}
          <div
            data-testid="muk-card"
            className="relative bg-cream text-ink border-4 border-ink shadow-brutal-slime overflow-hidden rotate-1 hover:rotate-0 transition-transform"
          >
            <div className="absolute top-4 left-4 z-10 bg-slime text-ink font-bangers text-base uppercase tracking-[0.2em] px-3 py-1.5 border-2 border-ink">
              ★ Muk Buddy = Filter Shield
            </div>
            <div className="absolute top-4 right-4 z-10 bg-muk text-cream font-bangers text-sm uppercase tracking-[0.15em] px-3 py-1.5 border-2 border-ink -rotate-3">
              Motor Saver
            </div>

            <div className="relative h-72 sm:h-96 overflow-hidden bg-cream-100">
              <img
                src={IMAGES.productShot}
                alt="Muk Buddy reusable 2-chamber wet/dry vac bag — catches dust before it ever reaches your filter, protecting your shop-vac motor"
                className="absolute inset-0 w-full h-full object-contain p-6"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink text-slime font-bangers text-base sm:text-lg tracking-wider px-4 py-1.5 border-2 border-ink shadow-brutal-sm whitespace-nowrap">
                CATCHES IT BEFORE THE FILTER
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="font-bangers text-3xl sm:text-5xl text-ink leading-[1]">
                Filter stays clean
                <br />
                <span className="text-muk">for years.</span>
              </div>
              <div className="font-mono text-[11px] text-ink/70 tracking-wider uppercase">
                // 2-chamber design · dust trapped in chamber 1, never hits the filter
              </div>
              <ul className="space-y-2 pt-2 text-ink">
                {[
                  "Catches muck BEFORE the filter",
                  "Filter lasts years, not jobs",
                  "Motor breathes easy — no overheating",
                  "Dump, rinse, reuse",
                  "$0 recurring filters · $0 new motors",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 font-bangers text-lg tracking-wider"
                  >
                    <Check className="w-5 h-5 text-slime-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Kicker / CTA */}
        <div className="mt-12 grid md:grid-cols-12 gap-6 items-center">
          <p
            data-testid="bagless-kicker"
            className="md:col-span-8 font-bowlby text-2xl sm:text-3xl lg:text-4xl leading-[1.1] text-ink"
          >
            Bagless isn't free.{" "}
            <span className="bg-muk text-cream px-2">
              It's a subscription to dead motors.
            </span>
          </p>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="bagless-cta"
            className="md:col-span-4 sticker-btn inline-flex items-center justify-center gap-3 bg-slime text-ink font-bangers text-xl sm:text-2xl uppercase tracking-wider px-6 py-4 border-4 border-ink rounded-sm shadow-brutal whitespace-nowrap"
          >
            Save The Motor →
          </a>
        </div>
      </div>
    </section>
  );
}

// Preserved export — used by many other sections for the section overline.
export function Overline({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-[3px] bg-muk" />
      <span className="font-bangers text-lg sm:text-xl uppercase tracking-[0.25em] text-muk">
        {children}
      </span>
    </div>
  );
}
