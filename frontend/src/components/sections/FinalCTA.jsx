import { ArrowRight } from "lucide-react";
import { ORDER_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export default function FinalCTA() {
  return (
    <section data-testid="final-cta-section" className="relative py-24 sm:py-40 overflow-hidden">
      {/* Full-bleed background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.finalCta})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-black/70" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-black/40" aria-hidden />
      <div className="absolute inset-0 grit opacity-50" aria-hidden />
      <div className="hazard-stripe h-3 absolute top-0 inset-x-0" aria-hidden />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="inline-flex items-center gap-3 border border-yellow-400/30 bg-yellow-400/5 px-3 py-1.5">
          <span className="w-2 h-2 bg-yellow-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            The Final Close
          </span>
        </div>

        <h2 className="font-anton text-5xl sm:text-7xl lg:text-9xl text-white mt-6 leading-[0.9]">
          This isn't a bag. <br />
          <span className="text-yellow-400">It's a fix.</span>
        </h2>

        <p className="mt-8 text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto">
          Wet/dry vacs haven't changed in decades. The problems haven't either:
          suction loss, clogged filters, worn-out motors, wasted money.{" "}
          <span className="text-white font-bold">
            Muk Buddy fixes the system causing all of it.
          </span>
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
          {["Stop losing suction.", "Stop replacing bags.", "Stop burning out equipment."].map((t) => (
            <div key={t} className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-4">
              <span className="font-anton text-lg text-white">{t}</span>
            </div>
          ))}
        </div>

        <a
          data-testid="final-order-btn"
          href={ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-3 bg-yellow-400 text-black font-bold uppercase tracking-wider px-10 py-6 border-2 border-yellow-400 hover:bg-black hover:text-yellow-400 transition-colors shadow-brutal text-base sm:text-lg"
        >
          Outfit Your Crews With Muk Buddy
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="mt-6 text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
          Start running a system that actually works.
        </p>
      </div>
    </section>
  );
}
