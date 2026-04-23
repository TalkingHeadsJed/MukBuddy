import { Overline } from "@/components/sections/Problem";
import { ArrowDown, Wind, Trash2, Droplets, ShieldCheck, ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/images";

const steps = [
  {
    n: "01",
    icon: ArrowDown,
    title: "Air + Debris Enters",
    desc: "Dirty air, dust, and liquid get pulled into Muk Buddy through the vacuum's intake — same as always.",
  },
  {
    n: "02",
    icon: Trash2,
    title: "Debris Drops Out",
    desc: "The inner column redirects heavy material downward. Dust, water, and solids fall into the bottom debris chamber — out of the airflow path.",
  },
  {
    n: "03",
    icon: Wind,
    title: "Clean Air Rises",
    desc: "Filter-grade reusable fabric lets air pass through freely while trapping fine particles. The airflow column stays open.",
  },
  {
    n: "04",
    icon: Droplets,
    title: "Filter Stays Dry",
    desc: "On wet jobs, liquid collects at the bottom chamber. The fabric breathes — so your vacuum's filter never sees the moisture.",
  },
  {
    n: "05",
    icon: ShieldCheck,
    title: "Motor Is Protected",
    desc: "Clean, consistent airflow reaches the motor. No choking. No overheating. No early burnout.",
  },
];

export default function TwoChamber() {
  return (
    <section data-testid="two-chamber-section" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>04 · How It Works</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          Debris and airflow <br />
          <span className="text-yellow-400">shouldn't fight each other.</span>
        </h2>
        <p className="mt-6 text-lg text-zinc-400 max-w-3xl">
          Disposable bags force everything through the same space — that's why
          they clog. Muk Buddy's 2-chamber design separates the two jobs.
          Here's exactly how it runs:
        </p>

        {/* Explainer grid: image left, steps right */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mt-16 items-start">
          {/* IMAGE SLOT — replace IMAGES.twoChamberDiagram with your product/cutaway photo */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div
              data-testid="two-chamber-image"
              className="relative border-2 border-yellow-400 bg-zinc-950 shadow-brutal"
            >
              <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold uppercase tracking-[0.2em] px-2 py-1 z-10">
                Fig.01 · Cutaway View
              </div>

              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={IMAGES.twoChamberDiagram}
                  alt="Muk Buddy 2-chamber design cutaway"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

                {/* Call-out label: Airflow column */}
                <Callout
                  className="top-[14%] left-[6%]"
                  label="Airflow Column"
                  tag="01"
                  dir="right"
                />
                {/* Call-out label: Filter */}
                <Callout
                  className="top-[38%] right-[6%]"
                  label="Reusable Filter Fabric"
                  tag="02"
                  dir="left"
                />
                {/* Call-out label: Debris chamber */}
                <Callout
                  className="bottom-[14%] left-[6%]"
                  label="Debris Chamber"
                  tag="03"
                  dir="right"
                />

                {/* Caption strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pt-10 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-[0.2em]">
                      // Patent-pending 2-chamber design
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      MB—01
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              * Diagram for illustration. Real product photo replaces this.
            </p>
          </div>

          {/* STEPS */}
          <div className="lg:col-span-7">
            <ol className="space-y-4">
              {steps.map(({ n, icon: Icon, title, desc }, i) => (
                <li
                  key={n}
                  data-testid={`chamber-step-${i}`}
                  className="group relative bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 hover:border-yellow-400 transition-colors"
                >
                  <div className="grid grid-cols-[auto_1fr] gap-5 p-5 sm:p-6">
                    {/* Number + icon column */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-400 text-black flex items-center justify-center font-anton text-xl">
                        {n}
                      </div>
                      <div className="w-px flex-1 bg-zinc-800 group-hover:bg-yellow-400 transition-colors min-h-[30px]" />
                      <Icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    {/* Content */}
                    <div className="pt-1">
                      <h3 className="font-anton text-2xl sm:text-3xl text-white">{title}</h3>
                      <p className="mt-2 text-base sm:text-lg text-zinc-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Outcome banner */}
            <div className="mt-6 bg-yellow-400 text-black p-6 sm:p-8 flex items-start gap-5">
              <div className="shrink-0 w-10 h-10 bg-black text-yellow-400 flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">The Outcome</span>
                <p className="mt-2 font-anton text-2xl sm:text-3xl leading-[1.05]">
                  Suction stays strong. Filter stays open. Motor keeps breathing — wet or dry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Callout({ className, label, tag, dir = "right" }) {
  const isRight = dir === "right";
  return (
    <div className={`absolute ${className} flex items-center gap-2`}>
      {isRight ? (
        <>
          <div className="bg-yellow-400 text-black font-anton text-sm px-2 py-0.5">{tag}</div>
          <div className="w-8 h-px bg-yellow-400" />
          <div className="bg-black/90 border border-yellow-400 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
            {label}
          </div>
        </>
      ) : (
        <>
          <div className="bg-black/90 border border-yellow-400 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
            {label}
          </div>
          <div className="w-8 h-px bg-yellow-400" />
          <div className="bg-yellow-400 text-black font-anton text-sm px-2 py-0.5">{tag}</div>
        </>
      )}
    </div>
  );
}
