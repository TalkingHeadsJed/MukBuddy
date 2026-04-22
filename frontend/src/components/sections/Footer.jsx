export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="hazard-stripe w-6 h-6" aria-hidden />
          <span className="font-anton text-xl tracking-tight text-white">
            MUK<span className="text-yellow-400">BUDDY</span>
          </span>
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
          © {new Date().getFullYear()} Muk Buddy · Built by a contractor, for contractors.
        </div>
        <div className="flex gap-6 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
          <a href="#faq" className="hover:text-yellow-400 transition-colors" data-testid="footer-faq">FAQ</a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors" data-testid="footer-contact">Contact</a>
          <a
            href="https://thefloorlord.com/product/muk-buddy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition-colors"
            data-testid="footer-order"
          >
            Order
          </a>
        </div>
      </div>
    </footer>
  );
}
