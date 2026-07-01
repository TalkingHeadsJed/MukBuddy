import { IMAGES } from "@/lib/images";

const VARIANTS = {
  straight: IMAGES.productStraight,
  tilt1: IMAGES.productTilted1,
  tilt2: IMAGES.productTilted2,
};

/**
 * Small Muk Buddy product PNG that floats to the right of a section headline.
 * Drop inside a `relative` section container. Hidden on mobile to keep headlines readable.
 *
 * Props:
 *  - variant: "straight" | "tilt1" | "tilt2"   (default "tilt1")
 *  - size: tailwind height class           (default "h-40 lg:h-52")
 *  - className: extra positioning classes  (default top-right)
 *  - rotate: degrees of rotation
 */
export default function HeadlinePeek({
  variant = "tilt1",
  size = "h-40 lg:h-52",
  className = "top-6 right-2 lg:top-4 lg:right-4",
  rotate = 0,
  testId,
  alt = "Muk Buddy patent-pending 2-chamber reusable shop vac bag — fits 12-20 gallon wet/dry vacs",
}) {
  const src = VARIANTS[variant] ?? VARIANTS.tilt1;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      data-testid={testId}
      className={`absolute pointer-events-none select-none hidden md:block z-0 ${size} ${className} drop-shadow-[0_8px_20px_rgba(122,111,224,0.25)]`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
}
