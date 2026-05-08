import { useEffect, useRef, useState } from "react";

/**
 * Number that ticks from 0 → target when scrolled into view.
 * Triggers once. Uses requestAnimationFrame for smooth easing.
 */
export default function CountUp({
  to,
  duration = 1500,
  prefix = "",
  suffix = "",
  format = (n) => Math.round(n).toLocaleString(),
}) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (fired.current) return;
      fired.current = true;
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
