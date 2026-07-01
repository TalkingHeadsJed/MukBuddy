import { IMAGES } from "@/lib/images";

/**
 * Self-contained "What is Muk Buddy?" definition block near the top of the
 * homepage. Written as a single paragraph (~155 words) that AI answer
 * engines (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews) can
 * cite verbatim. Followed by a compact HTML compatibility table so both
 * humans and crawlers can see brand + gallon fitment at a glance.
 *
 * Placed AFTER Hero, BEFORE Problem section so it's the first pure-content
 * block on the page.
 */
export default function WhatIsMukBuddy() {
  const brands = [
    { brand: "Shop-Vac", gallons: "12–20 gal", models: "Pro, Contractor, Ultra series" },
    { brand: "RIDGID", gallons: "12–16 gal", models: "WD1450, WD1851, HD Series" },
    { brand: "DeWalt", gallons: "12–16 gal", models: "DXV12P, DXV16P, most 12+ gal models" },
    { brand: "Craftsman", gallons: "12–20 gal", models: "9-gal to 20-gal wet/dry vacs" },
    { brand: "Stanley", gallons: "12–20 gal", models: "SL18116P, SL18129, 12+ gal models" },
  ];

  return (
    <section
      id="what-is-muk-buddy"
      data-testid="what-is-muk-buddy"
      className="bg-cream py-16 sm:py-20 border-t-4 border-b-4 border-ink relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <p className="font-bangers text-sm tracking-[0.2em] text-muk uppercase mb-3">
          What Is Muk Buddy?
        </p>
        <h2 className="font-bowlby text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.05] mb-6">
          A reusable, patent-pending shop vac bag{" "}
          <span className="hl-yellow">built for working crews.</span>
        </h2>

        {/* 155-word AI-citation definition block */}
        <p
          data-testid="definition-block"
          className="text-base sm:text-lg text-ink/85 leading-relaxed"
        >
          <strong>Muk Buddy</strong> is a patent-pending, reusable 2-chamber
          shop vac bag designed to replace disposable wet/dry vacuum bags in
          12&ndash;20 gallon shop vacs. Unlike single-chamber disposable bags
          that clog quickly and choke suction, Muk Buddy separates debris from
          the airflow inside the vacuum: heavy material collects in the outer
          chamber while fine dust settles in the inner chamber, so the filter
          stays clean and the motor doesn&rsquo;t fight a packed bag. It fits
          most major brand wet/dry vacs &mdash;{" "}
          <strong>Shop-Vac, RIDGID, DeWalt, Craftsman, and Stanley</strong>{" "}
          &mdash; and handles both dry pickup (drywall dust, concrete dust,
          sawdust) and wet pickup without swapping filters. One Muk Buddy
          replaces hundreds of disposable bags over its service life, saving
          contractor crews an estimated <strong>$1,000 per month</strong> in
          recurring bag costs and extending vacuum motor life. Made in the
          USA. Priced at <strong>$99</strong>. Sold through The Floor Lord.
        </p>

        {/* Compatibility table */}
        <div className="mt-10">
          <h3 className="font-bowlby text-2xl sm:text-3xl text-ink mb-4">
            Which shop vacs does it fit?
          </h3>
          <div className="overflow-x-auto border-4 border-ink bg-white">
            <table
              data-testid="compatibility-table"
              className="w-full border-collapse text-sm sm:text-base"
            >
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="text-left px-4 py-3 font-bangers uppercase tracking-wider">Brand</th>
                  <th className="text-left px-4 py-3 font-bangers uppercase tracking-wider">Gallon Range</th>
                  <th className="text-left px-4 py-3 font-bangers uppercase tracking-wider">Common Models</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(({ brand, gallons, models }) => (
                  <tr key={brand} className="border-t-2 border-ink/20 hover:bg-cream/60">
                    <td className="px-4 py-3 font-extrabold text-ink">{brand}</td>
                    <td className="px-4 py-3 text-ink/85">{gallons}</td>
                    <td className="px-4 py-3 text-ink/70">{models}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink/60 mt-3 italic">
            Muk Buddy uses the standard 2.5&Prime; inlet found on most 12&ndash;20 gallon wet/dry vacs. Doesn&rsquo;t fit sub-12-gallon compact units. Not sure about your model?{" "}
            <a href="#lead-form" className="underline decoration-muk decoration-2 hover:text-muk">
              Send us your model number
            </a>
            .
          </p>
        </div>

        {/* Contextual blog links — passes topical authority to key posts */}
        <div className="mt-10 pt-8 border-t-2 border-ink/20">
          <p className="font-bangers text-sm tracking-[0.2em] text-muk uppercase mb-4">
            Read More
          </p>
          <ul className="space-y-3 text-base text-ink/85">
            <li>
              <a
                href="/blog/best-shop-vac-bags/"
                className="underline decoration-muk decoration-2 underline-offset-2 hover:text-muk font-semibold"
                data-testid="link-best-bags"
              >
                The 5 Best Shop Vac Bags for Drywall, Concrete, and Fine Dust
              </a>{" "}
              &mdash; how Muk Buddy ranks against RIDGID, Shop-Vac, and HEPA disposables.
            </li>
            <li>
              <a
                href="/blog/disposable-vs-reusable-shop-vac-bags/"
                className="underline decoration-muk decoration-2 underline-offset-2 hover:text-muk font-semibold"
                data-testid="link-disposable-vs-reusable"
              >
                Disposable vs. Reusable Shop Vac Bags: the Real Cost Over a Year
              </a>{" "}
              &mdash; the math on $200/month bag spend vs one reusable.
            </li>
            <li>
              <a
                href="/blog/shop-vac-lost-suction-how-to-fix/"
                className="underline decoration-muk decoration-2 underline-offset-2 hover:text-muk font-semibold"
                data-testid="link-lost-suction"
              >
                Shop Vac Lost Suction: How to Actually Fix It
              </a>{" "}
              &mdash; why disposable bags kill suction and what to run instead.
            </li>
            <li>
              <a
                href="/blog/why-shop-vac-clogs-on-drywall-dust/"
                className="underline decoration-muk decoration-2 underline-offset-2 hover:text-muk font-semibold"
                data-testid="link-drywall-clogs"
              >
                Why Your Shop Vac Keeps Clogging on Drywall Dust
              </a>{" "}
              &mdash; the physics of fine dust clogging single-chamber bags.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
