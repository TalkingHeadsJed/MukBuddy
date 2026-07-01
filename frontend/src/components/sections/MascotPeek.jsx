import { IMAGES } from "@/lib/images";

/**
 * Muk Buddy mascot peeking in from a section edge with a speech bubble.
 * Crops just the monster (bottom ~55%) from the static logo PNG via overflow + margin trick.
 *
 * Usage:
 *   <MascotPeek side="left" tilt={-10} bubble="WATCH ME EAT!" />
 */
export default function MascotPeek({
  side = "right",
  tilt = -8,
  bubble,
  bubbleColor = "slime",
  size = 180,
  testId = "mascot-peek",
  className = "",
}) {
  const isLeft = side === "left";
  const bubbleBg =
    bubbleColor === "muk" ? "bg-muk text-cream" : "bg-slime text-ink";

  return (
    <div
      data-testid={testId}
      className={`pointer-events-none select-none absolute z-20 ${className}`}
      style={{
        width: size,
        transform: `rotate(${tilt}deg)`,
      }}
      aria-hidden
    >
      {/* Speech bubble */}
      {bubble && (
        <div
          className={`relative inline-block ${bubbleBg} font-bangers text-lg sm:text-2xl px-4 py-2 border-4 border-ink shadow-brutal mb-2 ${
            isLeft ? "ml-auto rotate-2" : "-rotate-2"
          }`}
          style={{ marginLeft: isLeft ? "auto" : 0 }}
        >
          {bubble}
          {/* Tail */}
          <span
            className={`absolute -bottom-3 ${
              isLeft ? "right-6" : "left-6"
            } w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px]`}
            style={{
              borderTopColor: bubbleColor === "muk" ? "#7A6FE0" : "#39FF14",
              filter: "drop-shadow(2px 2px 0 #1A0625)",
            }}
          />
        </div>
      )}

      {/* Mascot — crop bottom ~55% of logo PNG (the monster, no text) */}
      <div
        className="overflow-hidden animate-peek"
        style={{
          width: size,
          height: size * 0.7,
          transform: `scaleX(${isLeft ? -1 : 1})`,
        }}
      >
        <img
          src={IMAGES.logo}
          alt="Muk Buddy mascot — reusable shop vac bag"
          className="block"
          style={{
            width: "100%",
            height: "auto",
            marginTop: `-${size * 0.45}px`,
            filter: "drop-shadow(4px 4px 0 #1A0625)",
          }}
        />
      </div>
    </div>
  );
}
