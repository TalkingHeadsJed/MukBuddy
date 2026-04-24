import { useEffect, useState } from "react";
import { ORDER_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

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
          ? "bg-cream/90 backdrop-blur-md border-b-2 border-ink shadow-[0_4px_0_0_#1A0625]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="header-logo"
          className="flex items-center gap-3 group"
        >
          <img
            src={IMAGES.logo}
            alt="Muk Buddy"
            className="h-14 w-14 object-contain group-hover:animate-wobble"
          />
          <span className="hidden sm:inline-block font-bangers text-3xl tracking-wider text-ink">
            Muk <span className="text-muk">Buddy</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-bangers text-lg tracking-wider text-ink">
          <a href="#how-it-works" className="hover:text-muk transition-colors" data-testid="nav-how">
            How It Works
          </a>
          <a href="#the-money" className="hover:text-muk transition-colors" data-testid="nav-roi">
            The Money
          </a>
          <a href="#faq" className="hover:text-muk transition-colors" data-testid="nav-faq">
            FAQ
          </a>
          <a href="#contact" className="hover:text-muk transition-colors" data-testid="nav-contact">
            Contact
          </a>
        </nav>

        <a
          data-testid="header-order-btn"
          href={ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sticker-btn inline-flex items-center gap-2 bg-slime text-ink font-bangers text-lg sm:text-xl uppercase tracking-wider px-5 sm:px-7 py-2.5 border-2 border-ink shadow-brutal-sm rounded-sm"
        >
          Grab One
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
