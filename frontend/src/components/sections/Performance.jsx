import { Overline } from "@/components/sections/Problem";
import { Check, Droplets } from "lucide-react";

const DRY_IMG =
  "https://images.unsplash.com/photo-1679797878543-66c1e502d413?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwd29ya2VyJTIwY29udHJhY3RvcnxlbnwwfHx8fDE3NzY5MDA0ODF8MA&ixlib=rb-4.1.0&q=85";
const WET_IMG =
  "https://images.pexels.com/photos/3616735/pexels-photo-3616735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function Performance() {
  return (
    <section
      data-testid="performance-section"
      className="relative bg-zinc-950 border-y border-white/5"
    >
      {/* DRY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1 relative">
          <div className="relative aspect-[4/5] border-2 border-yellow-400 overflow-hidden">
            <img
              src={DRY_IMG}
              alt="Construction dust"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="font-mono text-xs text-yellow-400 uppercase tracking-[0.2em]">
                Drywall · Concrete · Fine Dust
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <Overline>05 · Dry Performance</Overline>
          <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white leading-[0.95]">
            Handles fine dust <br />
            <span className="text-yellow-400">without killing</span> performance.
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl">
            Drywall. Concrete. Fine dust. That's what destroys filters. Fine dust
            packs in, compresses, and shuts airflow down. Muk Buddy stops that
            before it starts.
          </p>
          <ul className="space-y-3 pt-2">
            {["Captures fine particles", "Keeps airflow open", "Protects your filter"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white text-lg">
                <Check className="w-5 h-5 text-yellow-400" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 pt-2">
            // Some contractors run the same filter for years.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hazard-stripe h-3" aria-hidden />

      {/* WET */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <Overline>06 · Wet Performance</Overline>
          <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white leading-[0.95]">
            Wet jobs don't have <br />
            to <span className="text-yellow-400">kill your suction.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl">
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
              <li key={t} className="flex items-start gap-3 text-white text-lg">
                <Droplets className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
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
          <div className="relative aspect-[4/5] border-2 border-white/10 overflow-hidden">
            <img
              src={WET_IMG}
              alt="Wet vacuum operation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5">
              Field-tested
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-zinc-800 bg-black p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 font-anton text-3xl text-yellow-400">{value}</div>
    </div>
  );
}
