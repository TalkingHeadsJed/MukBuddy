import { ArrowRight } from "lucide-react";

export default function Money() {
  return (
    <section
      id="the-money"
      data-testid="money-section"
      className="relative bg-yellow-400 text-black py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 grit opacity-40" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-black" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em]">
            08 · The Money
          </span>
        </div>
        <h2 className="font-anton text-5xl sm:text-7xl lg:text-8xl mt-4 leading-[0.9] max-w-5xl">
          What this is costing <br />
          you right now.
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          <Row
            label="Typical Crew"
            items={["1–3 bags / day", "~$10 / bag", "~$200 / month"]}
          />
          <Row
            label="5 Crews"
            emphasis
            items={["~$1,000 / month", "~$12,000 / year", "On bags alone."]}
          />
          <Row
            label="With Muk Buddy"
            items={["One reusable system", "No recurring bag cost", "Filters last longer"]}
          />
        </div>

        <div className="mt-14 border-t-2 border-black pt-10">
          <p className="font-anton text-3xl sm:text-5xl leading-[0.95] max-w-4xl">
            Even if you cut those numbers in half —{" "}
            <span className="bg-black text-yellow-400 px-2">
              you're still losing thousands every year.
            </span>
          </p>
          <a
            href="#contact"
            data-testid="money-cta"
            className="mt-8 inline-flex items-center gap-3 bg-black text-yellow-400 font-bold uppercase tracking-wider px-8 py-5 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors"
          >
            Stop Losing Money
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ label, items, emphasis }) {
  return (
    <div
      className={`p-6 sm:p-8 border-2 border-black ${
        emphasis ? "bg-black text-yellow-400" : "bg-yellow-400"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-[0.3em] ${
          emphasis ? "text-yellow-400" : "text-black"
        }`}
      >
        {label}
      </div>
      <ul className="mt-5 space-y-2">
        {items.map((t, i) => (
          <li
            key={i}
            className={`font-anton text-2xl sm:text-3xl leading-tight ${
              emphasis ? "text-yellow-400" : "text-black"
            }`}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
