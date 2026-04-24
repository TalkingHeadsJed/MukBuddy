import { ArrowRight, Star } from "lucide-react";
import { ORDER_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export default function FinalCTA() {
  return (
    <section
      data-testid="final-cta-section"
      className="relative py-24 sm:py-40 overflow-hidden halftone-muk"
    >
      <div className="slime-drip absolute top-0 inset-x-0" aria-hidden />
      <Star className="absolute top-24 left-6 w-8 h-8 text-cream fill-slime animate-wobble" aria-hidden />
      <Star className="absolute top-32 right-10 w-10 h-10 text-cream fill-slime animate-wobble" style={{ animationDelay: "0.6s" }} aria-hidden />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        {/* Mascot logo */}
        <div className="flex justify-center mb-8">
          <img
            src={IMAGES.logo}
            alt="Muk Buddy"
            className="w-64 sm:w-80 h-auto animate-bounce-slow drop-shadow-[8px_8px_0_#1A0625] border-4 border-ink"
          />
        </div>

        <div className="ribbon font-bangers text-xl">★ THE FINAL CLOSE ★</div>

        <h2 className="drip-title text-6xl sm:text-8xl lg:text-[8rem] mt-8 leading-[0.9]">
          THIS ISN'T A BAG. <br />
          IT'S A FIX.
        </h2>

        <p className="mt-10 font-paytone text-2xl sm:text-4xl text-cream max-w-3xl mx-auto leading-tight">
          Wet/dry vacs haven't changed in decades. <br />
          <span className="text-slime text-glow">The problems haven't either.</span>
        </p>

        <p className="mt-8 text-lg sm:text-xl text-cream/90 max-w-2xl mx-auto font-semibold">
          Suction loss. Clogged filters. Burned motors. Wasted money.{" "}
          <span className="text-cream font-extrabold">
            Muk Buddy devours the system causing all of it.
          </span>
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {["STOP LOSING SUCTION.", "STOP REPLACING BAGS.", "STOP BURNING MOTORS."].map((t) => (
            <div key={t} className="border-4 border-ink bg-cream p-4 shadow-brutal -rotate-1 hover:rotate-0 transition-transform">
              <span className="font-bangers text-xl sm:text-2xl text-ink tracking-wider">{t}</span>
            </div>
          ))}
        </div>

        <a
          data-testid="final-order-btn"
          href={ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sticker-btn mt-14 inline-flex items-center gap-3 bg-slime text-ink font-bangers text-3xl sm:text-4xl uppercase tracking-wider px-12 py-7 border-4 border-ink shadow-brutal rounded-sm"
        >
          Unleash Muk Buddy
          <ArrowRight className="w-7 h-7" />
        </a>
        <p className="mt-6 font-bangers text-xl text-cream tracking-[0.2em]">
          Start running a system that actually works.
        </p>
      </div>
    </section>
  );
}
