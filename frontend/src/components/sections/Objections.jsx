import { Overline } from "@/components/sections/Problem";

const items = [
  {
    q: "Using disposable bags?",
    a: "That's the cost you eliminate.",
  },
  {
    q: "Running without a bag?",
    a: "Then your filter is taking the full hit.",
  },
  {
    q: "Replacing filters often?",
    a: "That's airflow restriction already happening.",
  },
  {
    q: "Think your system is fine?",
    a: "If suction drops mid-job — it's not.",
  },
];

export default function Objections() {
  return (
    <section data-testid="objections-section" className="relative py-12 sm:py-16 bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>11 · Real Talk</Overline>
        <h2 className="font-anton text-3xl sm:text-4xl lg:text-5xl text-ink mt-3 leading-[1.0] max-w-4xl">
          Still on the fence?{" "}
          <span className="text-muk">Let's be straight.</span>
        </h2>

        <div className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
          {items.map((it, i) => (
            <div
              key={i}
              data-testid={`objection-${i}`}
              className="grid md:grid-cols-12 gap-3 py-3 sm:py-4 group hover:bg-cream-100 transition-colors px-4 -mx-4 items-center"
            >
              <div className="md:col-span-1 font-mono text-xs text-muk">
                /{String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-5 font-anton text-lg sm:text-xl text-ink">
                {it.q}
              </div>
              <div className="md:col-span-6 text-sm sm:text-base text-ink/80 md:text-right">
                <span className="hl-yellow font-bold">{it.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
