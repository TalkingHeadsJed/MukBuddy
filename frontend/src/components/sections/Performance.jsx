import { Overline } from "@/components/sections/Problem";
import { Check, Droplets } from "lucide-react";
import { IMAGES } from "@/lib/images";
import GeoStamp from "@/components/sections/GeoStamp";

const DRY_IMG = IMAGES.dry;
const WET_IMG = IMAGES.wet;

export default function Performance() {
  return (
    <section
      data-testid="performance-section"
      className="relative bg-white border-y border-ink/10"
    >
      {/* DRY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1 relative">
          <div className="relative aspect-[4/5] border-2 border-slime overflow-hidden">
            <img
              src={DRY_IMG}
              alt="Construction dust"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />
            <GeoStamp
              label="Drywall Remodel"
              date="MAR '26"
              tilt={-3}
              className="absolute top-4 right-4"
              testId="dry-geo"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="font-mono text-xs text-muk uppercase tracking-[0.2em]">
                Drywall · Concrete · Fine Dust
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <Overline>06 · Dry Performance</Overline>
          <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink leading-[0.95]">
            Handles fine dust <br />
            <span className="text-muk">without killing</span> performance.
          </h2>
          <p className="text-lg text-ink/70 max-w-xl">
            Drywall. Concrete. Fine dust. That's what destroys filters. Fine dust
            packs in, compresses, and shuts airflow down. Muk Buddy stops that
            before it starts.
          </p>
          <ul className="space-y-3 pt-2">
            {["Captures fine particles", "Keeps airflow open", "Protects your filter"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-ink text-lg">
                <Check className="w-5 h-5 text-muk" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50 pt-2">
            // Some contractors run the same filter for years.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hazard-stripe h-3" aria-hidden />

      {/* WET */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <Overline>07 · Wet Performance</Overline>
          <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink leading-[0.95]">
            Wet jobs don't have <br />
            to <span className="text-muk">kill your suction.</span>
          </h2>
          <p className="text-lg text-ink/70 max-w-xl">
            When moisture hits the filter, it clogs, hardens, and airflow drops
            fast. Now your motor is under load. Muk Buddy's 2-chamber system
            fixes that.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              "Internal column keeps moisture off the filter",
              "Filter stays dry and breathable",
              "Liquid moves to the bottom chamber",
              "Fabric lets moisture pass, holds debris",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-ink text-lg">
                <Droplets className="w-5 h-5 text-muk mt-1 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 pt-4 max-w-lg">
            <Stat label="Airflow" value="Open" />
            <Stat label="Suction" value="Strong" />
            <Stat label="Motor Strain" value="Less" />
            <Stat label="Cleanup" value="Easier" />
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] border-2 border-ink/15 overflow-hidden">
            <img
              src={WET_IMG}
              alt="Wet vacuum operation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
            <div className="absolute top-4 left-4 bg-slime text-black text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5">
              Field-tested
            </div>
            <GeoStamp
              label="Basement Flood"
              date="APR '26"
              tilt={3}
              className="absolute top-4 right-4"
              testId="wet-geo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-ink/20 bg-cream p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink/50">
        {label}
      </div>
      <div className="mt-1 font-anton text-3xl text-muk">{value}</div>
    </div>
  );
}
