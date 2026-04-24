import { IMAGES } from "@/lib/images";

/**
 * Floating Muk Buddy mascot that "peeks" into sections.
 * Place anywhere inside a `relative` parent. Controlled via className for placement.
 */
export default function MascotPeek({
  className = "",
  size = 140,
  flip = false,
  floating = true,
  testId = "mascot-peek",
}) {
  return (
    <div
      data-testid={testId}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-contain ${floating ? "animate-peek" : ""}`}
        style={{
          transform: flip ? "scaleX(-1)" : undefined,
          filter: "drop-shadow(0 8px 24px rgba(122,111,224,0.5))",
        }}
      >
        <source src={IMAGES.mascotAnimation} type="video/webm" />
      </video>
    </div>
  );
}
