import { Overline } from "@/components/sections/Problem";
import { Trash2, Recycle } from "lucide-react";

export default function WasteScale() {
  return (
    <section data-testid="waste-section" className="relative py-24 sm:py-32 bg-zinc-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Overline>09 · Waste + Scale</Overline>
        <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-white mt-4 leading-[0.95] max-w-5xl">
          Stop throwing away bags <br />
          <span className="text-yellow-400">every single day.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-14">
          <div data-testid="waste-before" className="bg-zinc-900 border border-red-500/20 p-8 sm:p-10">
            <Trash2 className="w-8 h-8 text-red-500 mb-6" />
            <h3 className="font-anton text-3xl text-white">Today</h3>
            <ul className="mt-6 space-y-2 text-zinc-300 text-lg">
              <li>• Hundreds of bags per crew per year</li>
              <li>• Thousands across a company</li>
              <li>• Landfill-bound every single week</li>
            </ul>
          </div>
          <div data-testid="waste-after" className="bg-yellow-400 text-black p-8 sm:p-10">
            <Recycle className="w-8 h-8 mb-6" />
            <h3 className="font-anton text-3xl">With Muk Buddy</h3>
            <ul className="mt-6 space-y-2 font-bold text-lg">
              <li>• One reusable system</li>
              <li>• Less waste. Less replacement.</li>
              <li>• More efficiency on every job.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
