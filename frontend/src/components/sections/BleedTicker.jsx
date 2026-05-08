import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

/**
 * Floating "you're bleeding $X right now" ticker.
 * Appears AFTER user scrolls past the Money section.
 * Hides automatically when the contact form is on screen (no double CTA).
 * Dismissable.
 *
 * Bleed rate is based on a typical 5-crew operation losing ~$12,000/yr on bags.
 * That's ~$0.000381/sec — invisible at integer scale, so we display in cents
 * with 4 decimals so the visitor SEES it tick.
 */
const ANNUAL_BLEED = 12000;
const PER_SEC = ANNUAL_BLEED / (365 * 24 * 60 * 60); // ≈ 0.000381

export default function BleedTicker() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [bleed, setBleed] = useState(0);
  const [t0] = useState(() => performance.now());

  // Show after scrolling past Money, hide when contact form is on screen
  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return;
      const money = document.getElementById("the-money");
      const contact = document.getElementById("contact");
      if (!money) return;
      const moneyTop = money.getBoundingClientRect().top;
      const contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
      // Trigger as soon as the Money section enters the viewport (top crosses bottom 85%)
      const past = moneyTop < window.innerHeight * 0.85;
      const atContact = contactTop < window.innerHeight * 0.6;
      setVisible(past && !atContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  // Tick the bleed counter every 100ms while visible
  useEffect(() => {
    if (!visible) return;
    let raf;
    const tick = () => {
      const elapsed = (performance.now() - t0) / 1000;
      setBleed(elapsed * PER_SEC);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, t0]);

  if (!visible || dismissed) return null;

  return (
    <div
      data-testid="bleed-ticker"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[300px] sm:max-w-[340px] animate-[fadeIn_0.4s_ease-out]"
      role="complementary"
      aria-label="Live cost reminder"
    >
      <div className="relative bg-ink text-cream border-4 border-slime shadow-brutal rounded-sm p-4 pr-9 -rotate-1 hover:rotate-0 transition-transform">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss reminder"
          data-testid="bleed-ticker-close"
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-slime text-ink border-2 border-cream flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="font-bangers text-xs sm:text-sm uppercase tracking-[0.22em] text-slime mb-1.5">
          ★ Live Bleed Counter ★
        </div>
        <div className="font-bowlby text-xl sm:text-2xl leading-tight text-cream">
          You've lost{" "}
          <span className="text-slime tabular-nums">
            ${bleed.toFixed(4)}
          </span>{" "}
          on bags since landing.
        </div>
        <div className="font-mono text-[10px] text-cream/55 mt-2 tracking-wider">
          // RATE: ~${ANNUAL_BLEED.toLocaleString()}/yr · 5-crew avg
        </div>
        <a
          href="#contact"
          data-testid="bleed-ticker-cta"
          onClick={() => setDismissed(true)}
          className="mt-3 inline-flex items-center gap-1.5 bg-slime text-ink font-bangers text-sm tracking-wider uppercase px-3 py-1.5 border-2 border-cream hover:translate-x-0.5 transition-transform"
        >
          Stop The Bleed
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
