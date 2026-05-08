import { Overline } from "@/components/sections/Problem";
import {
  Gauge,
  DollarSign,
  Filter,
  Zap,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { IMAGES } from "@/lib/images";

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
        <Overline>08 · What You Get</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink mt-4 leading-[0.95] max-w-5xl">
          What changes when <br />
          you use <span className="text-muk">Muk Buddy.</span>
        </h2>

        {/* Wide banner image */}
        <div className="relative mt-12 border-2 border-slime overflow-hidden">
          <img
            src={IMAGES.benefitsBanner}
            alt="Construction crew on jobsite"
            className="w-full h-64 sm:h-80 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-12 max-w-xl">
            <span className="font-mono text-xs text-muk uppercase tracking-[0.3em] mb-3">
              // Field-Proven Advantage
            </span>
            <p className="font-anton text-2xl sm:text-4xl text-ink leading-tight">
              Built to take a beating. <br />
              <span className="text-muk">Every crew. Every day.</span>
            </p>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              data-testid={`benefit-${i}`}
              className="group relative bg-white border border-ink/20 p-7 hover:border-slime transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-slime/10 border border-slime/40 flex items-center justify-center group-hover:bg-slime transition-colors">
                  <Icon className="w-6 h-6 text-muk group-hover:text-black transition-colors" />
                </div>
                <span className="font-mono text-xs text-ink/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-anton text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-ink/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
