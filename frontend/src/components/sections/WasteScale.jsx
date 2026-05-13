import { Overline } from "@/components/sections/Problem";
import { Trash2, Recycle } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function WasteScale() {
  return (
    <section data-testid="waste-section" className="relative py-12 sm:py-16 bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>09 · Waste + Scale</Overline>
        <h2 className="font-anton text-3xl sm:text-4xl lg:text-5xl text-ink mt-3 leading-[1.0] max-w-4xl">
          Stop throwing away bags{" "}
          <span className="text-muk">every single day.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div
            data-testid="waste-before"
            className="relative bg-white border border-muk/30 overflow-hidden flex flex-col sm:flex-row"
          >
            <div className="relative w-full sm:w-2/5 h-40 sm:h-auto overflow-hidden">
              <img
                src={IMAGES.waste}
                alt="Disposable bag waste"
                className="w-full h-full object-cover grayscale contrast-125"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white/30" />
              <div className="absolute top-3 left-3 bg-muk text-cream text-[10px] font-bold uppercase tracking-[0.25em] px-2 py-0.5">
                Today
              </div>
            </div>
            <div className="p-5 sm:p-6 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trash2 className="w-5 h-5 text-muk shrink-0" />
                <h3 className="font-anton text-xl sm:text-2xl text-ink">Piles Up Fast</h3>
              </div>
              <ul className="space-y-1 text-ink/80 text-sm sm:text-base">
                <li>• Hundreds of bags per crew per year</li>
                <li>• Thousands across a company</li>
                <li>• Landfill-bound every single week</li>
              </ul>
            </div>
          </div>

          <div data-testid="waste-after" className="bg-slime text-black p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Recycle className="w-5 h-5 shrink-0" />
              <h3 className="font-anton text-xl sm:text-2xl">With Muk Buddy</h3>
            </div>
            <ul className="space-y-1 font-bold text-sm sm:text-base flex-1">
              <li>• One reusable system</li>
              <li>• Less waste. Less replacement.</li>
              <li>• More efficiency on every job.</li>
            </ul>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-baseline gap-3">
              <span className="font-anton text-4xl sm:text-5xl leading-none">1</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] leading-tight">
                reusable system replaces hundreds of bags.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
