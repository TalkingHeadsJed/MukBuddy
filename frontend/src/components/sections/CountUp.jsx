import { useEffect, useRef, useState } from "react";

/**
 * Number that ticks from 0 → target when scrolled into view.
 * Triggers once. Uses requestAnimationFrame for smooth easing.
 *
 * SSR/prerender: useState is initialized to `to` so the prerendered HTML
 * carries the real number (not "$0"). On client mount, we drop back to 0
 * and animate up when the element enters the viewport.
 */
export default function CountUp({
  to,
  duration = 1500,
  prefix = "",
  suffix = "",
  format = (n) => Math.round(n).toLocaleString(),
}) {
  const ref = useRef(null);
  // Initialize to target so prerendered HTML shows the final number.
  const [n, setN] = useState(to);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (fired.current) return;
      fired.current = true;
      // Reset to 0 only when we're about to animate — this way the
      // prerendered HTML keeps the final target value visible if the
      // animation never fires (e.g., puppeteer SSR window).
      setN(0);
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setN(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} aria-label={`${prefix}${format(to)}${suffix}`}>
      {prefix}
      {format(n)}
      {suffix}
    </span>
  );
}
