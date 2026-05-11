import { Play, Sparkles, Star } from "lucide-react";
import { ORDER_URL, VIMEO_EMBED } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { useState } from "react";

export default function Hero() {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => setPlaying(true);

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-screen pt-28 pb-28 overflow-hidden halftone-cream"
    >
      {/* Soft glows */}
      <div
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(122,111,224,0.22), transparent 55%), radial-gradient(ellipse 60% 50% at 15% 85%, rgba(57,255,20,0.18), transparent 55%)",
        }}
        aria-hidden
      />
      {/* Decorative stars */}
      <Star className="absolute top-28 left-6 w-6 h-6 text-ink fill-slime animate-wobble" aria-hidden />
      <Star className="absolute top-40 right-10 w-8 h-8 text-ink fill-muk animate-wobble" style={{ animationDelay: "0.8s" }} aria-hidden />
      <Sparkles className="absolute bottom-40 left-16 w-8 h-8 text-muk animate-bounce-slow" aria-hidden />
      <Sparkles className="absolute bottom-24 right-24 w-10 h-10 text-slime-600 animate-bounce-slow" style={{ animationDelay: "1.2s" }} aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
        {/* LEFT */}
        <div className="lg:col-span-6 space-y-7 relative">
          <div className="ribbon font-bangers text-xl animate-wobble">
            ★ PATENTED · BUILT BY A CONTRACTOR ★
          </div>

          <h1
            data-testid="hero-headline"
            className="drip-title text-6xl sm:text-8xl lg:text-[7rem] leading-[0.9]"
          >
            MEET <br /> MUK BUDDY.
            <span className="sr-only">
              {" "}— The Reusable Wet/Dry Vac Bag Alternative. A patented 2-chamber filter
              system for shop vacuums and wet/dry vacuums that maintains suction,
              protects motors, and eliminates disposable bag costs for contractors.
            </span>
          </h1>

          <p className="font-paytone text-2xl sm:text-3xl lg:text-4xl text-ink leading-[1.05]">
            The first real innovation in shop vacs and wet/dry vacuums in{" "}
            <span className="hl-yellow">50 years.</span>
          </p>

          <p className="text-lg sm:text-xl text-ink/80 max-w-xl leading-relaxed font-semibold">
            A patented{" "}
            <span className="text-muk font-extrabold">2-chamber monster</span>{" "}
            that fits most 12–16 gallon Shop-Vac, Ridgid, Craftsman, Stanley and DeWalt wet/dry vacs.
            Devours dust, drinks up water, keeps suction strong, and{" "}
            <span className="text-ink font-extrabold">
              eats disposable bag costs for breakfast.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              data-testid="hero-order-btn"
              href={ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-btn inline-flex items-center justify-center gap-2 bg-slime text-ink font-bangers text-2xl sm:text-3xl uppercase tracking-wider px-8 py-5 border-4 border-ink shadow-brutal rounded-sm"
            >
              Feed The Monster
              <span aria-hidden>→</span>
            </a>
            <button
              data-testid="hero-watch-btn"
              onClick={handlePlay}
              className="sticker-btn inline-flex items-center justify-center gap-3 bg-cream text-ink font-bangers text-xl sm:text-2xl uppercase tracking-wider px-8 py-5 border-4 border-ink rounded-sm"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch It Eat
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-6">
            <Badge label="PATENTED 2-CHAMBER" />
            <Badge label="REUSABLE FABRIC" color="muk" />
            <Badge label="CONTRACTOR BUILT" />
          </div>
        </div>

        {/* RIGHT: Mascot LOGO (main visual) + video demo below */}
        <div className="lg:col-span-6 relative">
          {/* Tags floating around the logo */}
          <div className="absolute -top-2 -left-2 sm:-left-8 z-20 rotate-[-8deg]">
            <span className="ribbon font-bangers text-xl">RAWR!</span>
          </div>
          <div className="absolute top-4 -right-1 sm:right-2 z-20 rotate-[6deg]">
            <span className="inline-block bg-muk text-cream font-bangers text-xl px-3 py-1 border-2 border-ink shadow-brutal-sm tracking-wider">
              100% MUCK-HUNGRY
            </span>
          </div>

          {/* Big Hero Composite Card — clickable, plays video on click */}
          <button
            type="button"
            onClick={handlePlay}
            data-testid="hero-mascot"
            aria-label="Watch Muk Buddy demo"
            className="group relative bg-cream border-4 border-ink rounded-sm shadow-brutal-muk overflow-hidden block w-full text-left cursor-pointer"
          >
            <img
              src={IMAGES.heroComposite}
              alt="Muk Buddy patented 2-chamber reusable wet/dry vac bag held by contractor — alternative to disposable shop vacuum bags"
              className="relative w-full h-auto object-contain"
            />
            {/* Play button overlay */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors" />
              <span className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slime border-4 border-ink shadow-brutal flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform">
                <Play className="w-10 h-10 text-ink fill-current translate-x-0.5" />
              </span>
            </span>
            <span
              aria-hidden
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink text-cream font-bangers text-base sm:text-lg px-3 py-1 tracking-wider whitespace-nowrap shadow-brutal-sm"
            >
              ▶ WATCH IT EAT
            </span>
          </button>

          {/* Mini video demo card */}
          <button
            data-testid="hero-watch-btn-mini"
            onClick={handlePlay}
            className="sticker-btn mt-5 w-full bg-cream border-4 border-ink flex items-center gap-4 p-3 rounded-sm text-left"
          >
            <div className="shrink-0 w-14 h-14 bg-slime border-2 border-ink flex items-center justify-center">
              <Play className="w-6 h-6 text-ink fill-current translate-x-0.5" />
            </div>
            <div>
              <div className="font-bangers text-xl text-ink tracking-wider">SEE IT RUN</div>
              <div className="text-xs font-semibold text-ink/70">30s product demo · real contractor</div>
            </div>
            <span className="ml-auto font-bangers text-2xl text-muk pr-2">→</span>
          </button>

          {/* Video modal (Vimeo) */}
          {playing && (
            <div className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4" onClick={() => setPlaying(false)}>
              <div className="relative w-full max-w-5xl bg-ink border-4 border-slime shadow-brutal rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setPlaying(false)}
                  data-testid="hero-video-close"
                  className="absolute top-2 right-2 z-10 w-10 h-10 bg-slime text-ink font-bangers text-2xl border-2 border-ink flex items-center justify-center"
                  aria-label="Close video"
                >
                  ×
                </button>
                <div className="relative aspect-video">
                  <iframe
                    data-testid="hero-video"
                    src={`${VIMEO_EMBED}&autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Muk Buddy in action"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slime drip transition */}
      <div className="slime-drip absolute bottom-0 inset-x-0" aria-hidden />
    </section>
  );
}

function Badge({ label, color = "slime" }) {
  const bg = color === "muk" ? "bg-muk text-cream" : "bg-slime text-ink";
  return (
    <div className={`${bg} border-2 border-ink px-2 py-2 text-center shadow-brutal-sm`}>
      <span className="font-bangers text-xs sm:text-sm tracking-wider leading-tight block">
        {label}
      </span>
    </div>
  );
}
