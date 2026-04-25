import { X, AlertTriangle } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function Problem() {
  return (
    <section
      id="the-problem"
      data-testid="problem-section"
      className="relative py-24 sm:py-32 bg-white border-y border-ink/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>01 · The Problem</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-ink mt-4 max-w-5xl">
          Your crew either uses{" "}
          <span className="text-muk">disposable bags…</span>{" "}
          <br className="hidden sm:block" />
          or runs <span className="text-muk">bag-less.</span>
        </h2>
        <p className="mt-6 text-lg text-ink/70 max-w-3xl">
          There are only two ways crews run wet/dry vacs — and both are
          silently burning through your money, your motors, and your day.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-14">
          <Card
            testId="problem-card-bags"
            title="Disposable Bags"
            img={IMAGES.problemBags}
            items={["Rip open mid-job", "Get expensive fast", "Lose suction as they fill"]}
          />
          <Card
            testId="problem-card-bagless"
            title="Bag-less"
            img={IMAGES.problemBagless}
            badge={{ title: "DUST PARTICLE COUNT:", value: "☠ HIGH", unit: "ppm" }}
            items={[
              "All that dust hits your filter",
              "Filter clogs fast",
              "Your motor takes the hit",
            ]}
          />
        </div>

        <div className="mt-10 border-l-4 border-slime pl-6 py-2">
          <p className="text-xl sm:text-2xl font-bold text-ink">
            Different setup — same result:{" "}
            <span className="text-muk">restricted airflow, lost suction, more wear.</span>
          </p>
          <p className="mt-3 text-ink/70">
            You're basically running your vacuum commando.
          </p>
        </div>
      </div>
    </section>
  );
}

function Card({ testId, title, items, img, badge }) {
  return (
    <div
      data-testid={testId}
      className="relative bg-white border border-muk/30 hover:border-muk/60 transition-colors"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden border-b border-muk/30">
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover grayscale contrast-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div className="absolute top-4 left-4 bg-muk text-cream text-[10px] font-bold uppercase tracking-[0.25em] px-2 py-1">
          ✕ The Old Way
        </div>
      </div>

      {badge && (
        <div
          className="absolute z-20 right-4 sm:right-6 top-[160px] sm:top-[185px] rotate-[-6deg] bg-slime border-4 border-ink shadow-brutal px-4 py-2.5 max-w-[210px] hover:rotate-[-3deg] transition-transform"
          data-testid={`${testId}-lab-badge`}
        >
          <div className="font-mono text-[9px] tracking-[0.18em] text-ink/70 leading-tight uppercase">
            // Lab analysis · MB-2026
          </div>
          <div className="font-bangers text-base sm:text-lg leading-[1.05] text-ink tracking-wider mt-0.5">
            {badge.title}
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-bangers text-2xl text-ink leading-none">{badge.value}</span>
            <span className="font-mono text-[9px] text-ink/70 uppercase tracking-widest">{badge.unit}</span>
          </div>
        </div>
      )}
      <div className="p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-muk/10 border border-muk/40 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-muk" />
          </div>
          <h3 className="font-anton text-2xl sm:text-3xl text-ink">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-3 text-ink/80">
              <X className="w-5 h-5 text-muk shrink-0 mt-0.5" />
              <span className="text-base sm:text-lg">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

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
