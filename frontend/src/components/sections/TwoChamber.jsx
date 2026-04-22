import { Overline } from "@/components/sections/Problem";
import { ArrowDown, Wind, Trash2 } from "lucide-react";

export default function TwoChamber() {
  return (
    <section
      data-testid="two-chamber-section"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>04 · Why 2-Chamber Matters</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          Debris and airflow <br />
          <span className="text-yellow-400">shouldn't fight each other.</span>
        </h2>
        <p className="mt-6 text-lg text-zinc-400 max-w-3xl">
          Disposable bags force everything through the same space. That's why
          they clog. Muk Buddy's 2-chamber design separates the jobs.
        </p>

        <div className="grid md:grid-cols-12 gap-6 mt-14">
          {/* Diagram card */}
          <div className="md:col-span-7 relative bg-zinc-900 border border-zinc-800 p-8 sm:p-12 min-h-[420px] overflow-hidden">
            <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              FIG.01 / 2-CHAMBER FLOW
            </div>

            {/* Blueprint grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />

            <div className="relative grid grid-cols-2 gap-6 h-full">
              <Chamber
                number="01"
                title="Debris Chamber"
                icon={<Trash2 className="w-6 h-6" />}
                desc="Dust, water, and debris captured and held — out of the airflow path."
                testId="chamber-debris"
              />
              <Chamber
                number="02"
                title="Airflow Column"
                icon={<Wind className="w-6 h-6" />}
                desc="Clean airflow moves freely. Filter stays open. Motor breathes easy."
                testId="chamber-airflow"
              />
            </div>
          </div>

          {/* Result card */}
          <div className="md:col-span-5 bg-yellow-400 text-black p-8 sm:p-10 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.3em]">The Result</span>
            <div className="mt-6 space-y-5">
              <Result text="Suction stays consistent" />
              <Result text="The system doesn't choke" />
              <Result text="The motor isn't fighting to breathe" />
            </div>
            <div className="mt-auto pt-10 font-anton text-4xl sm:text-5xl leading-[0.95]">
              This is the difference.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chamber({ number, title, icon, desc, testId }) {
  return (
    <div data-testid={testId} className="relative border border-yellow-400/40 bg-black/40 p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-yellow-400">CH.{number}</span>
        <span className="text-yellow-400">{icon}</span>
      </div>
      <h4 className="font-anton text-2xl sm:text-3xl text-white mt-6">{title}</h4>
      <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{desc}</p>
      <ArrowDown className="w-5 h-5 text-yellow-400 mt-auto self-start animate-pulse" />
    </div>
  );
}

function Result({ text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-4 h-4 bg-black" />
      <span className="text-lg font-bold">{text}</span>
    </div>
  );
}
