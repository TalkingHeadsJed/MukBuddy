import { Wind, Thermometer, Flame, Filter, Gauge } from "lucide-react";
import { Overline } from "@/components/sections/Problem";

const points = [
  { icon: Gauge, label: "Suction drops" },
  { icon: Thermometer, label: "Motor works harder" },
  { icon: Flame, label: "Heat builds" },
  { icon: Filter, label: "Filters clog faster" },
  { icon: Wind, label: "Motors wear out sooner" },
];

export default function Airflow() {
  return (
    <section
      data-testid="airflow-section"
      className="relative py-24 sm:py-32 overflow-hidden bg-cream"
    >
      <div className="absolute inset-0 halftone-cream opacity-80" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(122,111,224,0.15), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Overline>03 · The Real Issue</Overline>
        <h2 className="font-bowlby text-5xl sm:text-7xl lg:text-8xl text-ink mt-4 leading-[0.9]">
          Everything <br />
          comes down to <br />
          <span className="text-muk">airflow.</span>
        </h2>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-4">
          {points.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              data-testid={`airflow-point-${i}`}
              className="group bg-white border-4 border-ink p-6 shadow-brutal-sm hover:shadow-brutal transition-all hover:-translate-y-1"
            >
              <Icon className="w-9 h-9 text-muk mb-4" />
              <p className="font-bangers text-lg tracking-wider text-ink leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-slime text-ink p-8 sm:p-10 max-w-4xl border-4 border-ink shadow-brutal -rotate-1">
          <p className="font-bowlby text-3xl sm:text-5xl leading-[1]">
            Restricted airflow is what's costing you money.
          </p>
        </div>
      </div>
    </section>
  );
}
