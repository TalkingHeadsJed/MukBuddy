// Centralized asset URLs — all self-hosted on Pair under /img/.
// Photos compressed to JPG, transparent product shots kept as PNG, video kept WebM/MP4.
export const IMAGES = {
  // === BRAND ASSETS ===
  logo: "/img/muk-buddy-logo.png",
  logoText: "/img/logo-text.png",
  heroComposite: "/img/hero-composite.png",
  spokesperson: "/img/spokesperson-angie.jpg",
  // Newer spokesperson shot — Angie holding the bag (yellow top, looking at camera)
  spokespersonAngie02: "/img/angie-spokesperson.png",

  // Background video — contractor vacuuming a floor (Kling-generated)
  // WebM (primary, 2.4MB) + MP4 (Safari < 16 fallback, 13MB)
  contractorVacVideoWebm: "/img/contractor-vacuuming.webm",
  contractorVacVideo: "/img/contractor-vacuuming.mp4",

  productShot: "/img/product-shot-detail.jpg",
  productShotBox: "/img/product-shot-1.jpg",

  // Headline peek-in variants (transparent PNGs of the Muk Buddy product)
  productStraight: "/img/product-straight.png",
  productTilted1: "/img/product-tilted-1.png",
  productTilted2: "/img/product-tilted-2.png",

  bagPileMountain: "/img/bag-pile-mountain.png",
  disposableBagsFan: "/img/disposable-bags-fan.jpg",
  disposableBagYellow: "/img/disposable-bag-yellow.jpg",
  contractorVac: "/img/contractor-with-vac.jpg",
  contractorBag: "/img/contractor-with-bag.jpg",
  messyJobsite1: "/img/messy-jobsite-1.jpg",
  messyJobsite2: "/img/messy-jobsite-2.jpg",
  mascotAnimation: "/img/mascot-animation.webm",
  productVideo: "/img/mascot-animation.webm",

  // === SECTION SLOTS ===

  // Hero bg (not actively used; Hero uses halftone+gradients)
  heroBg:
    "https://images.unsplash.com/photo-1690983320828-c01b88baacb0?crop=entropy&cs=srgb&fm=jpg&w=2400&q=70",

  // Problem — Disposable Bags card
  problemBags: "/img/contractor-with-bag.jpg",
  // Problem — Bag-less card (Carhartt contractor disgusted by dust-caked filter)
  problemBagless: "/img/howto-clean-filter.jpg",
  // Alt: contractor smiling, holding vac open with clogged filter inside
  dirtyFilterAlt: "/img/dirty-filter-alt.jpg",

  // Airflow bg (no longer rendered in Airflow.jsx; kept for safety)
  airflowBg:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2000&q=70",

  // Difference / In The Field card
  difference: "/img/contractor-with-vac.jpg",

  // Benefits — wide crew banner
  benefitsBanner: "/img/contractor-with-vac.jpg",

  // Dry performance — drywall / fine dust
  dry: "/img/messy-jobsite-2.jpg",

  // Wet performance
  wet: "/img/wet-job.jpg",

  // Waste / "Today's mess" card
  waste: "/img/messy-jobsite-1.jpg",

  // Testimonial portraits
  portrait1: "/img/portrait-1.jpg",
  portrait2: "/img/portrait-2.jpg",
  portrait3: "/img/portrait-3.jpg",
  portrait4: "/img/portrait-4.jpg",

  // Final CTA bg (mostly hidden behind purple halftone overlay)
  finalCta:
    "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=2000",

  // Bagless Lie section — generated illustration (clogged filter + smoking motor)
  baglessDisaster: "/bagless-disaster.png",

  // 2-Chamber visual (legacy; TwoChamber section now plays mascotAnimation)
  twoChamberDiagram: "/img/product-shot-1.jpg",
};
