import { useEffect, useState } from "react";
import { ORDER_URL } from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? "bg-black/85 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#top"
          data-testid="header-logo"
          className="flex items-center gap-2 group"
        >
          <span className="hazard-stripe w-6 h-6" aria-hidden />
          <span className="font-anton text-2xl tracking-tight text-white">
            MUK<span className="text-yellow-400">BUDDY</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          <a href="#how-it-works" className="hover:text-yellow-400 transition-colors" data-testid="nav-how">
            How It Works
          </a>
          <a href="#the-money" className="hover:text-yellow-400 transition-colors" data-testid="nav-roi">
            The Money
          </a>
          <a href="#faq" className="hover:text-yellow-400 transition-colors" data-testid="nav-faq">
            FAQ
          </a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors" data-testid="nav-contact">
            Contact
          </a>
        </nav>

        <a
          data-testid="header-order-btn"
          href={ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs sm:text-sm px-4 sm:px-6 py-3 border-2 border-yellow-400 hover:bg-black hover:text-yellow-400 transition-colors"
        >
          Order Now
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
