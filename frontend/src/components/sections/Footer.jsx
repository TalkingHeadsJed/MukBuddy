import { IMAGES } from "@/lib/images";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative bg-ink text-cream py-16 overflow-hidden">
      <div className="slime-drip absolute top-0 inset-x-0" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-3 group">
          <img
            src={IMAGES.logo}
            alt="Muk Buddy — reusable shop vac and wet/dry vacuum filter system"
            className="h-14 w-14 object-contain group-hover:animate-wobble"
          />
          <span className="font-bangers text-3xl tracking-wider text-cream">
            Muk <span className="text-slime">Buddy</span>
          </span>
        </a>
        <div className="font-bangers text-base uppercase tracking-[0.2em] text-cream/70">
          © {new Date().getFullYear()} · Built by a contractor, for contractors.
        </div>
        <div className="flex gap-6 font-bangers text-lg uppercase tracking-[0.2em] text-cream">
          <a href="/about" className="hover:text-slime transition-colors" data-testid="footer-about">About</a>
          <a href="/blog/" className="hover:text-slime transition-colors" data-testid="footer-blog">Blog</a>
          <a href="#faq" className="hover:text-slime transition-colors" data-testid="footer-faq">FAQ</a>
          <a href="#contact" className="hover:text-slime transition-colors" data-testid="footer-contact">Contact</a>
          <a
            href="https://thefloorlord.com/product/muk-buddy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slime transition-colors"
            data-testid="footer-order"
          >
            Order
          </a>
        </div>
      </div>
    </footer>
  );
}
