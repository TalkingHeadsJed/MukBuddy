import { Overline } from "@/components/sections/Problem";
import MascotPeek from "@/components/sections/MascotPeek";
import { ArrowDown, Wind, Trash2, Droplets, ShieldCheck, ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/images";

const steps = [
  {
    n: "01",
    icon: ArrowDown,
    title: "Air + Debris Enters",
    desc: "Dirty air, dust, and liquid get pulled into Muk Buddy through the vacuum's intake — same as always.",
  },
  {
    n: "02",
    icon: Trash2,
    title: "Debris Drops Out",
    desc: "The inner column redirects heavy material downward. Dust, water, and solids fall into the bottom debris chamber — out of the airflow path.",
  },
  {
    n: "03",
    icon: Wind,
    title: "Clean Air Rises",
    desc: "Filter-grade reusable fabric lets air pass through freely while trapping fine particles. The airflow column stays open.",
  },
  {
    n: "04",
    icon: Droplets,
    title: "Filter Stays Dry",
    desc: "On wet jobs, liquid collects at the bottom chamber. The fabric breathes — so your vacuum's filter never sees the moisture.",
  },
  {
    n: "05",
    icon: ShieldCheck,
    title: "Motor Is Protected",
    desc: "Clean, consistent airflow reaches the motor. No choking. No overheating. No early burnout.",
  },
];

export default function TwoChamber() {
  return (
    <section data-testid="two-chamber-section" className="relative py-24 sm:py-32 overflow-hidden bg-cream">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(#1A0625 1px, transparent 1px), linear-gradient(90deg, #1A0625 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      {/* Mascot peek — top right, pointing at the explainer */}
      <MascotPeek
        side="right"
        tilt={-8}
        bubble="WATCH ME EAT!"
        bubbleColor="slime"
        size={180}
        className="hidden lg:block top-12 right-4"
        testId="peek-twochamber"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>04 · How It Works</Overline>
        <h2 className="font-anton text-3xl sm:text-4xl lg:text-5xl text-ink mt-4 leading-[1.0] max-w-4xl">
          2 Chambers keep{" "}
          <span className="text-muk">air flowing.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-ink/70 max-w-3xl">
          Disposable bags force everything through the same space — that's why
          they clog. Muk Buddy's 2-chamber design separates the two jobs:
        </p>

        {/* Explainer grid: image left, steps right */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mt-16 items-start">
          {/* IMAGE SLOT — replace IMAGES.twoChamberDiagram with your product/cutaway photo */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div
              data-testid="two-chamber-image"
              className="relative border-2 border-slime bg-white shadow-brutal"
            >
              <div className="absolute -top-3 left-4 bg-slime text-ink text-xs font-bangers tracking-[0.15em] px-3 py-1.5 z-10 border-2 border-ink">
                ★ FIG.01 · HOW IT WORKS ★
              </div>

              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <video
                  src={IMAGES.mascotAnimation}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                  aria-label="Animated diagram of Muk Buddy patent-pending 2-chamber wet/dry vac filter mechanism showing airflow and debris separation"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

                {/* Caption strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink via-ink/70 to-transparent px-5 pt-10 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bangers text-sm text-slime tracking-[0.15em]">
                      ★ PATENT-PENDING 2-CHAMBER
                    </span>
                    <span className="font-mono text-[10px] text-cream/70">
                      MB—01
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
              * Diagram for illustration. Real product photo replaces this.
            </p>
          </div>

          {/* STEPS — 2-column grid (3 rows × 2 cols) so 5 steps + outcome match video height */}
          <div className="lg:col-span-7">
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="chamber-steps-grid">
              {steps.map(({ n, icon: Icon, title, desc }, i) => (
                <li
                  key={n}
                  data-testid={`chamber-step-${i}`}
                  className="group relative bg-white/80 backdrop-blur-sm border border-ink/20 hover:border-slime transition-colors p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-slime text-black flex items-center justify-center font-anton text-base shrink-0">
                      {n}
                    </div>
                    <Icon className="w-4 h-4 text-slime shrink-0" />
                    <h3 className="font-anton text-lg sm:text-xl text-ink leading-tight">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-ink/70 leading-snug">{desc}</p>
                </li>
              ))}

              {/* Outcome — 6th cell in the same grid */}
              <li className="relative bg-slime text-black p-4 sm:p-5 border-2 border-ink shadow-brutal-sm">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                    The Outcome
                  </span>
                </div>
                <p className="font-anton text-base sm:text-lg leading-tight">
                  Suction stays strong. Filter stays open. Motor keeps breathing — wet or dry.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Callout({ className, label, tag, dir = "right" }) {
  const isRight = dir === "right";
  return (
    <div className={`absolute ${className} flex items-center gap-2`}>
      {isRight ? (
        <>
          <div className="bg-slime text-black font-anton text-sm px-2 py-0.5">{tag}</div>
          <div className="w-8 h-px bg-slime" />
          <div className="bg-cream/90 border border-slime text-slime text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
            {label}
          </div>
        </>
      ) : (
        <>
          <div className="bg-cream/90 border border-slime text-slime text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
            {label}
          </div>
          <div className="w-8 h-px bg-slime" />
          <div className="bg-slime text-black font-anton text-sm px-2 py-0.5">{tag}</div>
        </>
      )}
    </div>
  );
}
