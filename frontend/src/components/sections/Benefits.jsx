import { Overline } from "@/components/sections/Problem";
import {
  Gauge,
  DollarSign,
  Filter,
  Zap,
  ShieldCheck,
  Clock,
} from "lucide-react";

const benefits = [
  { icon: Gauge, title: "Consistent Suction", desc: "From the first inch to the last." },
  { icon: DollarSign, title: "No Bag Costs", desc: "Replace disposable bags with a single reusable system." },
  { icon: Filter, title: "Longer Filter Life", desc: "Protected filter = years of service instead of weeks." },
  { icon: Zap, title: "Less Motor Strain", desc: "Airflow stays open. Motor doesn't fight to breathe." },
  { icon: ShieldCheck, title: "Fewer Breakdowns", desc: "Reduced wear = fewer service calls and downtime." },
  { icon: Clock, title: "Faster, Cleaner Jobs", desc: "Stop mid-job less. Finish more." },
];

export default function Benefits() {
  return (
    <section data-testid="benefits-section" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>07 · What You Get</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          What changes when <br />
          you use <span className="text-yellow-400">Muk Buddy.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              data-testid={`benefit-${i}`}
              className="group relative bg-zinc-900 border border-zinc-800 p-7 hover:border-yellow-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                  <Icon className="w-6 h-6 text-yellow-400 group-hover:text-black transition-colors" />
                </div>
                <span className="font-mono text-xs text-zinc-600">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-anton text-2xl text-white">{title}</h3>
              <p className="mt-3 text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
