import { Play, ShieldCheck, Wrench, Recycle } from "lucide-react";
import { ORDER_URL, VIMEO_EMBED } from "@/lib/constants";
import { useState } from "react";

const HERO_BG =
  "https://images.unsplash.com/photo-1690983320828-c01b88baacb0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY29uY3JldGUlMjB0ZXh0dXJlfGVufDB8fHx8MTc3NjkwMDQ5M3ww&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-[100vh] pt-24 pb-16 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/60" aria-hidden />
      <div className="absolute inset-0 -z-10 grit" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* LEFT */}
        <div className="lg:col-span-5 space-y-8">
          <div className="inline-flex items-center gap-3 border border-yellow-400/30 bg-yellow-400/5 px-3 py-1.5">
            <span className="w-2 h-2 bg-yellow-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
              Patent Pending · Built By A Contractor
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className="font-anton text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-white"
          >
            THE FIRST REAL <br />
            INNOVATION IN <br />
            <span className="text-yellow-400">WET/DRY VACS</span> <br />
            IN 50 YEARS.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed">
            Muk Buddy's patented{" "}
            <span className="text-white font-bold">2-chamber design</span>{" "}
            maintains suction, protects your motor, reduces filter wear, and{" "}
            <span className="hl-yellow text-white font-bold">
              eliminates disposable bag costs
            </span>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              data-testid="hero-order-btn"
              href={ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold uppercase tracking-wider px-8 py-5 border-2 border-yellow-400 hover:bg-black hover:text-yellow-400 transition-colors shadow-brutal-sm"
            >
              Order Muk Buddy Now
              <span aria-hidden>→</span>
            </a>
            <button
              data-testid="hero-watch-btn"
              onClick={() => setPlaying(true)}
              className="inline-flex items-center justify-center gap-3 bg-transparent text-white font-bold uppercase tracking-wider px-8 py-5 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch The Video
            </button>
          </div>

          {/* Quick Proof strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <Proof icon={<ShieldCheck className="w-5 h-5" />} label="Patented 2-Chamber Design" />
            <Proof icon={<Recycle className="w-5 h-5" />} label="Reusable Filter-Grade Fabric" />
            <Proof icon={<Wrench className="w-5 h-5" />} label="Built By A Contractor" />
          </div>
        </div>

        {/* RIGHT: Video */}
        <div className="lg:col-span-7">
          <div className="relative border-2 border-yellow-400 shadow-brutal">
            <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold uppercase tra-[0.2em] px-2 py-1 z-10">
              See It Run
            </div>
            <div className="relative aspect-video bg-zinc-950 overflow-hidden">
              {playing ? (
                <iframe
                  data-testid="hero-video-iframe"
                  src={`${VIMEO_EMBED}&autoplay=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Muk Buddy in Action"
                />
              ) : (
                <button
                  data-testid="hero-video-thumb"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center group"
                  aria-label="Play Muk Buddy video"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"
                    style={{
                      backgroundImage: `url(https://images.pexels.com/photos/3616735/pexels-photo-3616735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-black fill-current translate-x-0.5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-white">
                      Play Demo
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Proof({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-zinc-300">
      <span className="text-yellow-400 shrink-0">{icon}</span>
      <span className="text-sm font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
}
