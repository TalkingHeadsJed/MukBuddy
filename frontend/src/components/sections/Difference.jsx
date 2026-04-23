import { Overline } from "@/components/sections/Problem";
import { Zap } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function Difference() {
  return (
    <section
      id="how-it-works"
      data-testid="difference-section"
      className="relative py-24 sm:py-32 bg-zinc-950 border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>03 · The Difference</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          This is where Muk Buddy{" "}
          <span className="text-yellow-400">changes everything.</span>
        </h2>

        <div className="mt-10 grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Image panel */}
          <div className="relative lg:col-span-5 min-h-[320px] border-2 border-zinc-800 overflow-hidden">
            <img
              src={IMAGES.difference}
              alt="Wet/dry vacuum in contractor use"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5">
              In The Field
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-mono text-xs text-yellow-400 uppercase tracking-[0.2em]">
                // Standard wet/dry vac + Muk Buddy
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-8 sm:p-10 flex flex-col">
            <p className="text-xl text-zinc-400 leading-relaxed">
              Muk Buddy is{" "}
              <span className="text-white font-bold">not a disposable bag.</span>
            </p>
            <p className="mt-4 text-2xl sm:text-3xl text-white font-bold leading-snug">
              It's a system upgrade.
            </p>
            <p className="mt-6 text-lg text-zinc-400">
              Built around one idea:
            </p>
          </div>

          <div className="relative lg:col-span-3 bg-yellow-400 text-black p-8 sm:p-10 flex flex-col justify-center">
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
