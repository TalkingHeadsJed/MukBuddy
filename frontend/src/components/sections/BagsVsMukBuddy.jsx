import { ArrowRight, X, Check } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { ORDER_URL } from "@/lib/constants";
import CountUp from "@/components/sections/CountUp";
import HeadlinePeek from "@/components/sections/HeadlinePeek";

export default function BagsVsMukBuddy() {
  return (
    <section
      id="bags-vs-muk-buddy"
      data-testid="bags-vs-section"
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <div className="absolute inset-0 halftone-cream opacity-90" aria-hidden />
      <div className="slime-drip-muk absolute top-0 inset-x-0" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <HeadlinePeek variant="tilt1" rotate={-8} className="top-10 right-4 lg:top-6 lg:right-8" testId="peek-bags" />
        {/* Overline */}
        <div className="flex items-center gap-3 pt-8">
          <span className="w-8 h-[3px] bg-muk" />
          <span className="font-bangers text-lg sm:text-xl uppercase tracking-[0.25em] text-muk">
            01.5 · The Stupidity Tax
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-bowlby text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.0] text-ink max-w-4xl">
          One Muk Buddy replaces{" "}
          <span className="text-muk">
            <CountUp to={500} duration={3500} suffix="+" />
          </span>{" "}
          disposable bags.
        </h2>
        <p className="mt-5 font-paytone text-xl sm:text-2xl text-ink/80 max-w-3xl leading-tight">
          Stop buying paper bags.{" "}
          <span className="hl-yellow">Buy one thing. Use it forever.</span>
        </p>

        {/* The comparison */}
        <div className="mt-12 grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
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

            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="font-bangers text-3xl sm:text-4xl text-cream leading-[1]">
                  <CountUp to={500} duration={3500} suffix="+ bags" />
                </div>
                <div className="font-mono text-[11px] text-cream/70 tracking-wider uppercase">
                  // 1–3 / day · $10 ea · forever
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Rip mid-job",
                  "Suction drops",
                  "$$$ monthly",
                  "Trash mountain",
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 bg-ink border-2 border-cream/30 text-cream/90 font-bangers text-sm tracking-wider px-2.5 py-1 leading-none"
                  >
                    <X className="w-3.5 h-3.5 text-muk shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
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
                alt="Muk Buddy reusable wet/dry vac bag with retail packaging — patent-pending 2-chamber filter alternative to disposable shop vac bags"
                className="absolute inset-0 w-full h-full object-contain p-6"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink text-slime font-bangers text-base sm:text-lg tracking-wider px-4 py-1.5 border-2 border-ink shadow-brutal-sm">
                ONE-TIME PURCHASE
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="font-bangers text-3xl sm:text-4xl text-ink leading-[1]">
                  1 Muk Buddy.
                </div>
                <div className="font-mono text-[11px] text-ink/70 tracking-wider uppercase">
                  // Reusable · 2-chamber · rinse clean
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Rugged fabric",
                  "Suction stays strong",
                  "No filter needed!",
                  "$0 recurring",
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 bg-cream border-2 border-ink/20 text-ink font-bangers text-sm tracking-wider px-2.5 py-1 leading-none"
                  >
                    <Check className="w-3.5 h-3.5 text-slime-600 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kicker / CTA */}
        <div className="mt-12 grid md:grid-cols-12 gap-6 items-center">
          <p className="md:col-span-8 font-bowlby text-2xl sm:text-3xl lg:text-4xl leading-[1.1] text-ink">
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
            className="md:col-span-4 sticker-btn inline-flex items-center justify-center gap-3 bg-slime text-ink font-bangers text-xl sm:text-2xl uppercase tracking-wider px-6 py-4 border-4 border-ink rounded-sm shadow-brutal whitespace-nowrap"
          >
            Switch Forever
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
