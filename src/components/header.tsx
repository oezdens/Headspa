import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import HeaderImg from "../Bilder/Header.png";
import { Menu, X, Phone, Mail } from "lucide-react";

export function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // If we're not on home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Keep header visually stable when the vertical scrollbar appears/disappears.
  // Some overlays (dropdowns/modals) can change documentElement.clientWidth; compensate by applying
  // equivalent padding-right to the inner header container (.max-w-7xl).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const headerInnerSelector = "header .max-w-7xl";
    const allContainersSelector = ".max-w-7xl";
    const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

    const apply = () => {
      const sw = getScrollbarWidth();
      // apply exact compensation to header inner container
      const headerInner = document.querySelector(headerInnerSelector) as HTMLElement | null;
      if (headerInner) headerInner.style.paddingRight = sw > 0 ? `${sw}px` : "";

      // also apply to all page containers that use max-w-7xl to keep layout stable
      const els = Array.from(document.querySelectorAll(allContainersSelector)) as HTMLElement[];
      els.forEach((el) => {
        // avoid overwriting if element is the document root
        el.style.paddingRight = sw > 0 ? `${sw}px` : "";
      });
    };

    // run initially
    apply();

    const onResize = () => apply();
    window.addEventListener("resize", onResize);

    // observe attribute changes on body/html which some libraries use to lock scrolling
    const obs = new MutationObserver(() => apply());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      window.removeEventListener("resize", onResize);
      obs.disconnect();
      // cleanup any applied inline style
      const headerInner = document.querySelector(headerInnerSelector) as HTMLElement | null;
      if (headerInner) headerInner.style.paddingRight = "";

      const els = Array.from(document.querySelectorAll(allContainersSelector)) as HTMLElement[];
      els.forEach((el) => (el.style.paddingRight = ""));
    };
  }, []);

  // Keep a CSS variable updated with the current header height so pages can offset their content.
  useEffect(() => {
    const setHeaderHeight = () => {
      const el = headerRef.current || document.querySelector('header');
      if (!el) return;
      const h = (el as HTMLElement).offsetHeight;
      try {
        document.documentElement.style.setProperty('--header-height', `${h}px`);
      } catch (e) {}
    };

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    const obsTarget = headerRef.current || document.querySelector('header');
    const mo = new MutationObserver(setHeaderHeight);
    if (obsTarget) mo.observe(obsTarget as Node, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => {
      window.removeEventListener('resize', setHeaderHeight);
      mo.disconnect();
    };
  }, [isScrolled]);

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#FFD700] focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Zum Hauptinhalt springen
      </a>
      
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        {/* Login removed per request */}
        <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scrollToSection("hero")} 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded"
              aria-label="Zur Startseite"
            >
              <img src={HeaderImg} alt="Capillus HEADSPA Logo" className="h-12 md:h-16 object-contain" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12" aria-label="Hauptnavigation">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-white/80 hover:text-[#FFD700] transition-colors text-sm tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
            >
              Startseite
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-white/80 hover:text-[#FFD700] transition-colors text-sm tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
            >
              Services
            </button>
            {/* Vorteile removed */}
            <button
              onClick={() => scrollToSection("booking")}
              className="text-white/80 hover:text-[#FFD700] transition-colors text-sm tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
            >
              Buchung
            </button>
            <div className="h-8 w-px bg-white/20"></div>
            <a 
              href="tel:+493012345678" 
              className="text-white/60 hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded p-1"
              aria-label="Anrufen: +49 30 12345678"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a 
              href="mailto:capillusheadspa@gmail.com" 
              className="text-white/60 hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded p-1"
              aria-label="E-Mail senden an capillusheadspa@gmail.com"
            >
              <Mail className="w-5 h-5" />
            </a>
          </nav>

          {/* CTA Button */}
          <Button
            onClick={() => scrollToSection("booking")}
            className="hidden md:flex bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black border-0 px-6 transition-colors transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Zum Buchungsformular springen"
          >
            Termin buchen
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded p-1"
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-6 pb-6 border-t border-white/10 pt-6 bg-black/90 backdrop-blur-md -mx-4 px-4">
            <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-white/80 hover:text-[#FFD700] transition-colors text-left tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
                >
                  Startseite
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white/80 hover:text-[#FFD700] transition-colors text-left tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
                >
                  Services
                </button>
                {/* Vorteile removed */}
                <button
                  onClick={() => scrollToSection("booking")}
                  className="text-white/80 hover:text-[#FFD700] transition-colors text-left tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
                >
                  Buchung
                </button>
                {/* Login removed from mobile menu */}
              <Button
                onClick={() => scrollToSection("booking")}
                className="mt-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black border-0 transition-colors transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Zum Buchungsformular springen"
              >
                Termin buchen
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
}