import { ArrowRight } from "lucide-react";
import CountUp from "@/components/sections/CountUp";

export default function MoneyReminder() {
  return (
    <section
      data-testid="money-reminder"
      className="relative bg-ink text-cream py-10 sm:py-14 overflow-hidden"
    >
      <div className="slime-drip absolute top-0 inset-x-0" aria-hidden />
      <div className="slime-drip-muk absolute bottom-0 inset-x-0 rotate-180" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="font-bangers text-base sm:text-lg uppercase tracking-[0.25em] text-slime mb-2">
            ★ Quick Reminder ★
          </div>
          <p className="font-bowlby text-2xl sm:text-4xl lg:text-5xl leading-[1.05] text-cream">
            While you've been reading, you've still been losing{" "}
            <span className="text-slime whitespace-nowrap">
              <CountUp prefix="~$" to={2400} suffix="/yr" duration={1800} />
            </span>{" "}
            on bags.
          </p>
          <p className="mt-3 font-bangers text-base sm:text-lg text-cream/70 tracking-wider">
            (And that's just for one crew.)
          </p>
        </div>
        <a
          href="#contact"
          data-testid="reminder-cta"
          className="sticker-btn shrink-0 inline-flex items-center gap-2 bg-slime text-ink font-bangers text-xl sm:text-2xl uppercase tracking-wider px-6 sm:px-8 py-4 border-4 border-cream rounded-sm whitespace-nowrap"
        >
          Stop The Bleed
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
