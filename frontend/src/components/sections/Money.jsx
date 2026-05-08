import { ArrowRight } from "lucide-react";
import MascotPeek from "@/components/sections/MascotPeek";
import CountUp from "@/components/sections/CountUp";

export default function Money() {
  return (
    <section
      id="the-money"
      data-testid="money-section"
      className="relative bg-ink text-cream py-24 sm:py-32 overflow-hidden"
    >
      <div className="slime-drip-muk absolute top-0 inset-x-0" aria-hidden />
      <div className="absolute inset-0 grit opacity-30" aria-hidden />

      {/* Mascot peek — leaning in from right edge with a "$$$" speech bubble */}
      <MascotPeek
        side="right"
        tilt={-12}
        bubble="$$$ STOP IT!"
        bubbleColor="slime"
        size={200}
        className="hidden lg:block top-32 right-4"
        testId="peek-money"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-8">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-slime" />
          <span className="font-bangers text-xl text-slime uppercase tracking-[0.2em]">
            08 · The Money
          </span>
        </div>
        <h2 className="font-bowlby text-4xl sm:text-6xl lg:text-7xl mt-6 leading-[1] max-w-5xl text-cream">
          Disposable bags are <br />
          costing you <span className="text-slime">this much!</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          <Row
            label="Typical Crew"
            items={[
              "1–3 bags / day",
              "~$10 / bag",
              { prefix: "~$", value: 200, suffix: " / month" },
            ]}
          />
          <Row
            label="5 Crews"
            emphasis
            items={[
              { prefix: "~$", value: 1000, suffix: " / month" },
              { prefix: "~$", value: 12000, suffix: " / year" },
              "On bags alone.",
            ]}
          />
          <Row
            label="With Muk Buddy"
            highlight
            items={["One reusable system", "No recurring bag cost", "Filters last longer"]}
          />
        </div>

        <div className="mt-14 border-t-2 border-slime/40 pt-10">
          <p className="font-bowlby text-3xl sm:text-5xl leading-[1.05] max-w-4xl">
            Even if you cut those numbers in half —{" "}
            <span className="bg-slime text-ink px-2">
              you're still losing thousands every year.
            </span>
          </p>
          <a
            href="#contact"
            data-testid="money-cta"
            className="sticker-btn mt-10 inline-flex items-center gap-3 bg-slime text-ink font-bangers text-2xl uppercase tracking-wider px-8 py-5 border-4 border-cream rounded-sm"
          >
            Stop Losing Money
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ label, items, emphasis, highlight }) {
  const bg = emphasis ? "bg-muk text-cream" : highlight ? "bg-slime text-ink" : "bg-cream text-ink";
  const labelColor = emphasis ? "text-cream" : "text-ink";
  return (
    <div className={`p-6 sm:p-8 border-4 border-cream ${bg} shadow-brutal-slime`}>
      <div className={`font-bangers text-xl uppercase tracking-[0.2em] ${labelColor}`}>
        {label}
      </div>
      <ul className="mt-5 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="font-bowlby text-2xl sm:text-3xl leading-tight">
            {typeof t === "object" ? (
              <CountUp prefix={t.prefix} to={t.value} suffix={t.suffix} duration={1600} />
            ) : (
              t
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
