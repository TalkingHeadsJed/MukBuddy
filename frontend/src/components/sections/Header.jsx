import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ORDER_URL } from "@/lib/constants";
import { appendAttribution } from "@/lib/attribution";
import { IMAGES } from "@/lib/images";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on link click
  const closeNav = () => setOpen(false);

  const navItems = [
    { label: "How It Works", href: "#how-it-works", testId: "nav-how" },
    { label: "The Money", href: "#the-money", testId: "nav-roi" },
    { label: "FAQ", href: "#faq", testId: "nav-faq" },
    { label: "Contact", href: "#contact", testId: "nav-contact" },
  ];

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled || open
          ? "bg-cream/95 backdrop-blur-md border-b-2 border-ink shadow-[0_4px_0_0_#1A0625]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="header-logo"
          onClick={closeNav}
          className="flex items-center gap-3 group"
        >
          <img
            src={IMAGES.logo}
            alt="Muk Buddy logo — reusable wet/dry vac bag and shop vacuum filter brand"
            className="h-14 w-14 object-contain group-hover:animate-wobble"
          />
          <span className="hidden sm:inline-block font-bangers text-3xl tracking-wider text-ink">
            Muk <span className="text-muk">Buddy</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 font-bangers text-lg tracking-wider text-ink">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={n.testId}
              className="hover:text-muk transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            data-testid="header-order-btn"
            href={appendAttribution(ORDER_URL)}
            target="_blank"
            rel="noopener noreferrer"
            className="sticker-btn inline-flex items-center gap-2 bg-slime text-ink font-bangers text-lg sm:text-xl uppercase tracking-wider px-5 sm:px-7 py-2.5 border-2 border-ink shadow-brutal-sm rounded-sm"
          >
            Grab One
            <span aria-hidden>→</span>
          </a>

          {/* Mobile hamburger */}
          <button
            data-testid="mobile-nav-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-11 h-11 border-2 border-ink bg-cream flex items-center justify-center shadow-brutal-sm"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6 text-ink" /> : <Menu className="w-6 h-6 text-ink" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          data-testid="mobile-nav"
          className="md:hidden border-t-2 border-ink bg-cream/95 backdrop-blur-md"
        >
          <ul className="max-w-7xl mx-auto px-4 py-4 flex flex-col">
            {navItems.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  data-testid={`mobile-${n.testId}`}
                  onClick={closeNav}
                  className="block font-bangers text-2xl tracking-wider text-ink py-3 border-b-2 border-ink/10 hover:text-muk transition-colors"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
