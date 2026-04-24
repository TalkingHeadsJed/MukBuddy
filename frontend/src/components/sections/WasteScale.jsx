import { Overline } from "@/components/sections/Problem";
import { Trash2, Recycle } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function WasteScale() {
  return (
    <section data-testid="waste-section" className="relative py-24 sm:py-32 bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>09 · Waste + Scale</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-ink mt-4 leading-[0.95] max-w-5xl">
          Stop throwing away bags <br />
          <span className="text-muk">every single day.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-14">
          <div
            data-testid="waste-before"
            className="relative bg-white border border-muk/30 overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden border-b border-muk/30">
              <img
                src={IMAGES.waste}
                alt="Disposable bag waste"
                className="w-full h-full object-cover grayscale contrast-125"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-muk text-cream text-[10px] font-bold uppercase tracking-[0.25em] px-2 py-1">
                Today
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <Trash2 className="w-8 h-8 text-muk mb-6" />
              <h3 className="font-anton text-3xl text-ink">Piles Up Fast</h3>
              <ul className="mt-6 space-y-2 text-ink/80 text-lg">
                <li>• Hundreds of bags per crew per year</li>
                <li>• Thousands across a company</li>
                <li>• Landfill-bound every single week</li>
              </ul>
            </div>
          </div>

          <div data-testid="waste-after" className="bg-slime text-black p-8 sm:p-10 flex flex-col">
            <Recycle className="w-8 h-8 mb-6" />
            <h3 className="font-anton text-3xl">With Muk Buddy</h3>
            <ul className="mt-6 space-y-2 font-bold text-lg flex-1">
              <li>• One reusable system</li>
              <li>• Less waste. Less replacement.</li>
              <li>• More efficiency on every job.</li>
            </ul>
            <div className="mt-8 pt-8 border-t-2 border-black">
              <div className="flex items-baseline gap-3">
                <span className="font-anton text-5xl sm:text-6xl leading-none">1</span>
                <span className="text-sm font-bold uppercase tracking-[0.25em]">
                  reusable system <br />
                  replaces thousands of bags.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
