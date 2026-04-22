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
    <section data-testid="objections-section" className="relative py-24 sm:py-32 bg-zinc-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>11 · Real Talk</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          Still on the fence? <br />
          <span className="text-yellow-400">Let's be straight.</span>
        </h2>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {items.map((it, i) => (
            <div
              key={i}
              data-testid={`objection-${i}`}
              className="grid md:grid-cols-12 gap-4 py-8 group hover:bg-zinc-900/50 transition-colors px-4 -mx-4"
            >
              <div className="md:col-span-1 font-mono text-sm text-yellow-400 pt-1">
                /{String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-5 font-anton text-2xl sm:text-3xl text-white">
                {it.q}
              </div>
              <div className="md:col-span-6 text-lg text-zinc-300 md:text-right">
                <span className="hl-yellow font-bold">{it.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
