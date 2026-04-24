import { Play, Sparkles, Star } from "lucide-react";
import { ORDER_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { useRef, useState } from "react";

export default function Hero() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

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
          </h1>

          <p className="font-paytone text-2xl sm:text-3xl lg:text-4xl text-ink leading-[1.05]">
            The first real innovation in wet/dry vacs in{" "}
            <span className="hl-yellow">50 years.</span>
          </p>

          <p className="text-lg sm:text-xl text-ink/80 max-w-xl leading-relaxed font-semibold">
            A patented{" "}
            <span className="text-muk font-extrabold">2-chamber monster</span>{" "}
            that devours dust, drinks up water, keeps suction strong, and{" "}
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

          {/* Big Hero Composite Card (mascot + spokesperson + actual product) */}
          <div
            data-testid="hero-mascot"
            className="relative bg-cream border-4 border-ink rounded-sm shadow-brutal-muk overflow-hidden"
          >
            <img
              src={IMAGES.heroComposite}
              alt="Muk Buddy mascot with the patented 2-chamber product in hand"
              className="relative w-full h-auto object-contain"
            />
          </div>

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

          {/* Video modal/inline */}
          {playing && (
            <div className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4" onClick={() => setPlaying(false)}>
              <div className="relative w-full max-w-4xl bg-ink border-4 border-slime shadow-brutal rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setPlaying(false)}
                  className="absolute top-2 right-2 z-10 w-10 h-10 bg-slime text-ink font-bangers text-2xl border-2 border-ink flex items-center justify-center"
                  aria-label="Close video"
                >
                  ×
                </button>
                <video
                  ref={videoRef}
                  data-testid="hero-video"
                  src={IMAGES.productVideo}
                  className="w-full h-auto"
                  controls
                  autoPlay
                  playsInline
                />
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
