
import { useState, useEffect } from "react";
import { useScrollPosition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { name: "Über uns", href: "#about" },
    { name: "Produkte", href: "#products" },
    { name: "Dienstleistungen", href: "#features" },
    { name: "Kontakt", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple px-6 md:px-12",
        scrollPosition > 10 
          ? "py-3 bg-white/90 backdrop-blur-lg wzw-shadow"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          {/* WZW Logo */}
          <div className="relative h-10 w-24">
            <svg viewBox="0 0 120 48" className="h-full w-full">
              <path 
                d="M0 10 L20 10 L15 30 L30 10 L50 10 L40 40 L30 40 L35 25 L20 40 L10 40 L0 10Z" 
                fill="hsl(var(--primary))"
              />
              <path 
                d="M55 10 L105 10 L100 20 L80 20 L75 30 L95 30 L90 40 L50 40 L55 30 L75 30 L80 20 L60 20 L55 10Z" 
                fill="hsl(var(--secondary))"
              />
              <path 
                d="M110 10 L120 10 L110 40 L100 40 L110 10Z" 
                fill="hsl(var(--primary))"
              />
            </svg>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors duration-300"
            >
              {item.name}
            </a>
          ))}
          <a 
            href="#contact" 
            className="text-sm font-medium px-5 py-2 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-300"
          >
            Anfrage
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-apple pt-24",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="flex flex-col items-center gap-8 p-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-xl font-medium hover:text-secondary transition-colors duration-300 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                <ChevronRight className="w-5 h-5 text-secondary" />
              </a>
            ))}
            <a 
              href="#contact" 
              className="mt-4 text-xl font-medium px-6 py-3 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Anfrage
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
