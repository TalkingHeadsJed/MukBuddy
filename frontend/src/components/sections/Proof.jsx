import { Overline } from "@/components/sections/Problem";
import { IMAGES } from "@/lib/images";

const quotes = [
  { text: "With Muk Buddy the suction is stronger and more consistent through the entire job. So we get done faster.", attr: "Drywall Contractor", portrait: IMAGES.portrait1 },
  { text: "I haven't used a filter or disposable bag in over a year. More money for me!", attr: "Concrete Cutter", portrait: IMAGES.portrait3 },
  { text: "Feels like a brand new machine.", attr: "Remodel Crew Lead", portrait: IMAGES.portrait2 },
  { text: "It's paid for itself in less than a month!", attr: "Finish Carpenter", portrait: IMAGES.portrait4 },
];

export default function Proof() {
  return (
    <section data-testid="proof-section" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>10 · From The Field</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink mt-4 leading-[0.95] max-w-5xl">
          What contractors <br />
          notice <span className="text-muk">immediately.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              data-testid={`quote-${i}`}
              className="relative bg-white border border-ink/20 p-8 sm:p-10 hover:border-slime transition-colors group"
            >
              <div className="absolute -top-4 left-6 font-anton text-7xl text-muk/30 leading-none select-none">
                &ldquo;
              </div>
              <p className="relative font-anton text-3xl sm:text-4xl text-ink leading-tight">
                {q.text}
              </p>
              <footer className="mt-6 pt-6 border-t border-ink/20 flex items-center gap-4">
                <div className="relative w-12 h-12 shrink-0 border border-slime/40 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  <img
                    src={q.portrait}
                    alt={`${q.attr} — contractor using Muk Buddy reusable shop vac bag`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-px bg-slime" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-ink/70">
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
