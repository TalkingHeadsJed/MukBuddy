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
    q: "Will it fit my vacuum?",
    a: "Muk Buddy is built to work with standard wet/dry vacs used on jobsites. Specific fit details are listed on the product page — check the product page before ordering or contact us with your model number.",
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
