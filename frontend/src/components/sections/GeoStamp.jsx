import { MapPin } from "lucide-react";

/**
 * Tiny "real photo" geo-stamp / field log tag.
 * Place on top of a section image to signal authenticity.
 */
export default function GeoStamp({
  label,
  date,
  tilt = -3,
  className = "",
  testId = "geo-stamp",
}) {
  return (
    <div
      data-testid={testId}
      className={`inline-flex items-center gap-1.5 bg-cream border-2 border-ink px-2 py-1 shadow-brutal-sm ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-hidden
    >
      <MapPin className="w-3 h-3 text-muk shrink-0" />
      <span className="font-mono text-[9px] tracking-[0.18em] text-ink uppercase leading-none">
        {label}
        {date && <span className="text-ink/60"> · {date}</span>}
      </span>
    </div>
  );
}
