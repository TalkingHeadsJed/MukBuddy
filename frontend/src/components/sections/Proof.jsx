import { Overline } from "@/components/sections/Problem";
import { IMAGES } from "@/lib/images";

const quotes = [
  { text: "It keeps pulling.", attr: "Drywall Contractor", portrait: IMAGES.portrait1 },
  { text: "Feels like a different machine.", attr: "Remodel Crew Lead", portrait: IMAGES.portrait2 },
  { text: "Filter lasts way longer.", attr: "Concrete Cutter", portrait: IMAGES.portrait3 },
  { text: "Way less stopping.", attr: "Finish Carpenter", portrait: IMAGES.portrait4 },
];

export default function Proof() {
  return (
    <section data-testid="proof-section" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>10 · From The Field</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          What contractors <br />
          notice <span className="text-yellow-400">immediately.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              data-testid={`quote-${i}`}
              className="relative bg-zinc-900 border border-zinc-800 p-8 sm:p-10 hover:border-yellow-400 transition-colors group"
            >
              <div className="absolute -top-4 left-6 font-anton text-7xl text-yellow-400/30 leading-none select-none">
                &ldquo;
              </div>
              <p className="relative font-anton text-3xl sm:text-4xl text-white leading-tight">
                {q.text}
              </p>
              <footer className="mt-6 pt-6 border-t border-zinc-800 flex items-center gap-4">
                <div className="relative w-12 h-12 shrink-0 border border-yellow-400/40 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  <img
                    src={q.portrait}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-px bg-yellow-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
                    {q.attr}
                  </span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
