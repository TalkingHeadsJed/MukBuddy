import { ArrowRight, X, Check } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { ORDER_URL } from "@/lib/constants";
import CountUp from "@/components/sections/CountUp";

export default function BagsVsMukBuddy() {
  return (
    <section
      id="bags-vs-muk-buddy"
      data-testid="bags-vs-section"
      className="relative bg-cream py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 halftone-cream opacity-90" aria-hidden />
      <div className="slime-drip-muk absolute top-0 inset-x-0" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Overline */}
        <div className="flex items-center gap-3 pt-8">
          <span className="w-8 h-[3px] bg-muk" />
          <span className="font-bangers text-lg sm:text-xl uppercase tracking-[0.25em] text-muk">
            01.5 · The Stupidity Tax
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-bowlby text-5xl sm:text-7xl lg:text-[5.5rem] mt-6 leading-[0.95] text-ink max-w-5xl">
          One Muk Buddy <br />
          replaces{" "}
          <span className="text-muk">
            <CountUp to={500} duration={3500} suffix="+" />
          </span>{" "}
          <br />
          disposable bags.
        </h2>
        <p className="mt-6 font-paytone text-2xl sm:text-3xl text-ink/80 max-w-3xl leading-tight">
          Stop buying paper bags. <br />
          <span className="hl-yellow">Buy one thing. Use it forever.</span>
        </p>

        {/* The comparison */}
        <div className="mt-16 grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT — Pile of disposable bags */}
          <div
            data-testid="bags-card"
            className="relative bg-ink text-cream border-4 border-ink shadow-brutal overflow-hidden -rotate-1 hover:-rotate-0 transition-transform"
          >
            <div className="absolute top-4 left-4 z-10 bg-muk text-cream font-bangers text-base uppercase tracking-[0.2em] px-3 py-1.5 border-2 border-cream">
              ✕ The Old Way
            </div>
            <div className="absolute top-4 right-4 z-10 bg-cream text-ink font-bangers text-sm uppercase tracking-[0.15em] px-3 py-1.5 border-2 border-ink rotate-3">
              1 Year. 1 Crew.
            </div>

            <div className="relative h-72 sm:h-96 overflow-hidden bg-ink">
              <img
                src={IMAGES.bagPileMountain}
                alt="A mountain of hundreds of disposable wet/dry vac bags piled in a warehouse — the recurring waste of running disposable shop vac bags"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="font-bangers text-3xl sm:text-5xl text-cream leading-[1]">
                <CountUp to={500} duration={3500} suffix="+ bags" />
              </div>
              <div className="font-mono text-xs text-cream/70 tracking-wider uppercase">
                // ~1–3 bags / day · $10 / bag · forever
              </div>
              <ul className="space-y-2 pt-2 text-cream/90">
                {[
                  "Rip open mid-job",
                  "Suction drops as they fill",
                  "Filter clogs anyway",
                  "$$$ every single month",
                  "Mountain of trash by year's end",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 font-bangers text-lg tracking-wider">
                    <X className="w-5 h-5 text-muk shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — One Muk Buddy */}
          <div
            data-testid="muk-card"
            className="relative bg-cream text-ink border-4 border-ink shadow-brutal-slime overflow-hidden rotate-1 hover:rotate-0 transition-transform"
          >
            <div className="absolute top-4 left-4 z-10 bg-slime text-ink font-bangers text-base uppercase tracking-[0.2em] px-3 py-1.5 border-2 border-ink">
              ★ The New Way
            </div>
            <div className="absolute top-4 right-4 z-10 bg-muk text-cream font-bangers text-sm uppercase tracking-[0.15em] px-3 py-1.5 border-2 border-ink -rotate-3">
              Years. Same Crew.
            </div>

            <div className="relative h-72 sm:h-96 overflow-hidden bg-cream-100">
              <img
                src={IMAGES.productShot}
                alt="Muk Buddy reusable wet/dry vac bag with retail packaging — patented 2-chamber filter alternative to disposable shop vac bags"
                className="absolute inset-0 w-full h-full object-contain p-6"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink text-slime font-bangers text-base sm:text-lg tracking-wider px-4 py-1.5 border-2 border-ink shadow-brutal-sm">
                ONE-TIME PURCHASE
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="font-bangers text-3xl sm:text-5xl text-ink leading-[1]">
                1 Muk Buddy.
              </div>
              <div className="font-mono text-xs text-ink/70 tracking-wider uppercase">
                // Reusable · 2-chamber · empties &amp; rinses clean
              </div>
              <ul className="space-y-2 pt-2 text-ink">
                {[
                  "Doesn't rip — rugged fabric",
                  "Suction stays strong all job",
                  "Filter stays clean for years",
                  "$0 recurring cost",
                  "Zero bag waste, ever",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 font-bangers text-lg tracking-wider">
                    <Check className="w-5 h-5 text-slime-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Kicker / CTA */}
        <div className="mt-14 grid md:grid-cols-12 gap-6 items-center">
          <p className="md:col-span-8 font-bowlby text-3xl sm:text-5xl leading-[1.05] text-ink">
            If you're still buying bags after this,{" "}
            <span className="bg-muk text-cream px-2">
              the bags are buying you.
            </span>
          </p>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="bags-vs-cta"
            className="md:col-span-4 sticker-btn inline-flex items-center justify-center gap-3 bg-slime text-ink font-bangers text-2xl uppercase tracking-wider px-8 py-5 border-4 border-ink rounded-sm shadow-brutal whitespace-nowrap"
          >
            Switch Forever
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
