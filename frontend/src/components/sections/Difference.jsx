import { Overline } from "@/components/sections/Problem";
import { Zap } from "lucide-react";
import { IMAGES } from "@/lib/images";
import GeoStamp from "@/components/sections/GeoStamp";

export default function Difference() {
  return (
    <section
      id="how-it-works"
      data-testid="difference-section"
      className="relative py-24 sm:py-32 bg-white border-y border-ink/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>04 · The Difference</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink mt-4 leading-[0.95] max-w-5xl">
          This is where Muk Buddy{" "}
          <span className="text-muk">changes everything.</span>
        </h2>

        <div className="mt-10 grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Image panel */}
          <div className="relative lg:col-span-5 min-h-[320px] border-2 border-ink/20 overflow-hidden">
            <img
              src={IMAGES.difference}
              alt="Standard wet/dry vacuum being used by a contractor with Muk Buddy reusable bag installed"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
            <div className="absolute top-4 left-4 bg-slime text-black text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5">
              In The Field
            </div>
            <GeoStamp
              label="Active Crew"
              date="2026"
              tilt={4}
              className="absolute top-4 right-4"
              testId="difference-geo"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-mono text-xs text-muk uppercase tracking-[0.2em]">
                // Standard wet/dry vac + Muk Buddy
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-ink/20 p-8 sm:p-10 flex flex-col">
            <p className="text-xl text-ink/70 leading-relaxed">
              Muk Buddy is{" "}
              <span className="text-ink font-bold">not a disposable bag.</span>
            </p>
            <p className="mt-4 text-2xl sm:text-3xl text-ink font-bold leading-snug">
              It's a system upgrade.
            </p>
            <p className="mt-6 text-lg text-ink/70">
              Built around one idea:
            </p>
          </div>

          <div className="relative lg:col-span-3 bg-slime text-black p-8 sm:p-10 flex flex-col justify-center">
            <Zap className="w-10 h-10 mb-4" />
            <p className="font-anton text-2xl sm:text-3xl leading-[0.95]">
              A 2-chamber design that separates debris from airflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
