import { Overline } from "@/components/sections/Problem";
import MascotPeek from "@/components/sections/MascotPeek";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is Muk Buddy exactly?",
    a: "Muk Buddy is a patented 2-chamber insert that fits inside your existing wet/dry vacuum. It separates debris from airflow so your filter stays clean, your motor stays protected, and your suction stays strong — wet or dry.",
  },
  {
    q: "Can you use a wet/dry vac without a bag?",
    a: "Yes — technically — but you shouldn't run it that way for long. Without a bag, all the dust, drywall, and fine debris slams directly into the filter. The filter clogs fast, suction drops, and your motor works overtime trying to pull air through clogged media. That's the exact failure mode Muk Buddy solves: a patented 2-chamber design separates debris from airflow so your filter stays clean and your motor stays protected — no disposable bags required.",
  },
  {
    q: "Why does my wet/dry vac keep losing suction?",
    a: "Three usual suspects: (1) a clogged filter from running bag-less with fine dust, (2) a disposable bag that's full or torn and choking the airflow path, or (3) a blocked hose. The root cause is almost always airflow restriction — when debris and airflow share the same path, dust packs into the filter and suction collapses. Muk Buddy's 2-chamber design routes debris into a separate chamber so airflow stays clean and suction stays strong across the entire job.",
  },
  {
    q: "Can you reuse disposable vacuum bags?",
    a: "Disposable wet/dry vac bags are designed to be thrown out — they tear easily once emptied, the filter media degrades after one fill, and shaking them out releases all the fine dust you just collected. Trying to reuse them is messy, ineffective, and a health hazard. The real fix is a reusable system built for repeated use, which is exactly what Muk Buddy is: rugged filter fabric over a 2-chamber design, designed to be emptied, rinsed, and re-installed for the life of your vac.",
  },
  {
    q: "Muk Buddy vs disposable wet/dry vacuum bags — what's the difference?",
    a: "Disposable bags: ~$10 each, 1–3 bags burned per crew per day, suction drops as they fill, rip mid-job, all debris hits your filter when they break. Muk Buddy: one-time reusable 2-chamber system, no recurring bag cost, debris stays separated from airflow so suction stays strong, the filter stays clean for years, and it handles both wet and dry pickup. A typical 5-crew operation saves about $12,000/yr on bags alone after switching.",
  },
  {
    q: "Will it fit my vacuum?",
    a: "Muk Buddy is designed for most 12–20 gallon wet/dry vacs from Shop-Vac, Ridgid, Craftsman, Stanley, DeWalt, Milwaukee, Vacmaster, and Armor All — and crews regularly use it on smaller sizes too. Specific fit details are on the product page — check the product page before ordering or contact us with your model number.",
  },
  {
    q: "Does it replace my filter?",
    a: "No. Muk Buddy works with your existing filter — and actually protects it. Because debris and airflow are separated, your filter sees far less wear, which is why some contractors run the same filter for years.",
  },
  {
    q: "Can I use it for wet jobs?",
    a: "Yes. The 2-chamber design channels liquid to the bottom chamber while the filter stays dry and breathable. Suction stays strong, cleanup is easier, and the motor isn't loaded down.",
  },
  {
    q: "How long does it last?",
    a: "Muk Buddy uses filter-grade reusable fabric designed for repeated cleaning. With normal care it replaces a continuous stream of disposable bags for the life of your vac.",
  },
  {
    q: "How do I clean it?",
    a: "Empty the debris chamber between jobs. Shake, rinse or hose off the fabric as needed. No special solvents. No disposal fee. No paper bag to tear.",
  },
  {
    q: "What does it cost vs disposable bags?",
    a: "A typical crew spends roughly $200/month on disposable bags — about $12,000/year across 5 crews. Muk Buddy is a one-time system upgrade that replaces that recurring cost.",
  },
  {
    q: "How do I order?",
    a: "Order directly from the product page at thefloorlord.com. If you have questions about fit, volume pricing, or how it works on your crews, use the contact form below and we'll get back to you.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" data-testid="faq-section" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Mascot peek — left edge, leaning in beside the FAQ */}
      <MascotPeek
        side="left"
        tilt={6}
        bubble="ASK ME!"
        bubbleColor="muk"
        size={170}
        className="hidden lg:block top-24 left-4"
        testId="peek-faq"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Overline>12 · FAQ</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink mt-4 leading-[0.95]">
          Straight answers, <br />
          <span className="text-muk">no fluff.</span>
        </h2>

        <Accordion
          type="single"
          collapsible
          className="mt-12 border-y border-ink/15 divide-y divide-ink/15"
        >
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              data-testid={`faq-item-${i}`}
              className="border-b-0"
            >
              <AccordionTrigger className="font-anton text-xl sm:text-2xl text-ink uppercase hover:no-underline hover:text-muk py-6 text-left">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base sm:text-lg text-ink/70 leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
