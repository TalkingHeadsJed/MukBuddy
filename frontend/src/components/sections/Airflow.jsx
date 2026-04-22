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
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 grit opacity-40" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Overline>02 · The Real Issue</Overline>
        <h2 className="font-anton text-5xl sm:text-7xl lg:text-8xl text-white mt-4 leading-[0.9]">
          Everything <br />
          comes down to <br />
          <span className="text-yellow-400">airflow.</span>
        </h2>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-4">
          {points.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              data-testid={`airflow-point-${i}`}
              className="group bg-zinc-900 border border-zinc-800 p-6 hover:border-yellow-400 transition-colors"
            >
              <Icon className="w-8 h-8 text-yellow-400 mb-4" />
              <p className="text-sm sm:text-base font-bold uppercase tracking-wide text-white leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-400 text-black p-8 sm:p-10 max-w-4xl">
          <p className="font-anton text-3xl sm:text-5xl leading-[0.95]">
            Restricted airflow is what's costing you money.
          </p>
        </div>
      </div>
    </section>
  );
}
