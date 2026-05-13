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
import HeadlinePeek from "@/components/sections/HeadlinePeek";

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
    <section data-testid="benefits-section" className="relative py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <HeadlinePeek variant="tilt1" rotate={-6} className="top-6 right-4 lg:top-2 lg:right-8" testId="peek-benefits" />
        <Overline>08 · What You Get</Overline>
        <h2 className="font-anton text-3xl sm:text-4xl lg:text-5xl text-ink mt-3 leading-[1.0] max-w-4xl">
          What changes when you use{" "}
          <span className="text-muk">Muk Buddy.</span>
        </h2>

        {/* Wide banner image */}
        <div className="relative mt-8 border-2 border-slime overflow-hidden">
          <img
            src={IMAGES.benefitsBanner}
            alt="Construction crew on jobsite"
            className="w-full h-40 sm:h-52 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8 max-w-xl">
            <span className="font-mono text-[10px] text-muk uppercase tracking-[0.3em] mb-1.5">
              // Field-Proven Advantage
            </span>
            <p className="font-anton text-xl sm:text-3xl text-ink leading-tight">
              Built to take a beating.{" "}
              <span className="text-muk">Every crew. Every day.</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              data-testid={`benefit-${i}`}
              className="group relative bg-white border border-ink/20 p-4 sm:p-5 hover:border-slime transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-slime/10 border border-slime/40 flex items-center justify-center group-hover:bg-slime transition-colors shrink-0">
                  <Icon className="w-4 h-4 text-muk group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-anton text-lg sm:text-xl text-ink leading-tight">
                  {title}
                </h3>
                <span className="ml-auto font-mono text-[10px] text-ink/40">
                  0{i + 1}
                </span>
              </div>
              <p className="text-sm text-ink/70 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
