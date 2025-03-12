
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { threshold: 0.1 });

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="py-16 md:py-24 px-6 bg-primary text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className={cn(
            "opacity-0",
            isInView && "animate-fade-in"
          )}>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <div className="relative h-8 w-20 mr-2">
                <svg viewBox="0 0 120 48" className="h-full w-full">
                  <path 
                    d="M0 10 L20 10 L15 30 L30 10 L50 10 L40 40 L30 40 L35 25 L20 40 L10 40 L0 10Z" 
                    fill="white"
                  />
                  <path 
                    d="M55 10 L105 10 L100 20 L80 20 L75 30 L95 30 L90 40 L50 40 L55 30 L75 30 L80 20 L60 20 L55 10Z" 
                    fill="hsl(var(--secondary))"
                  />
                  <path 
                    d="M110 10 L120 10 L110 40 L100 40 L110 10Z" 
                    fill="white"
                  />
                </svg>
              </div>
            </h3>
            <p className="text-white/70 mb-6">
              Wir schaffen durchdachte Lösungen mit Präzision und Sorgfalt, 
              konzentrieren uns auf Einfachheit und auf das, was wirklich wichtig ist.
            </p>
          </div>

          <div className={cn(
            "opacity-0 animation-delay-100",
            isInView && "animate-fade-in"
          )}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Navigation</h4>
            <ul className="space-y-4">
              {["Über uns", "Produkte", "Dienstleistungen", "Kontakt"].map((item, index) => (
                <li key={item}>
                  <a 
                    href={`#${["about", "products", "features", "contact"][index]}`}
                    className="text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(
            "opacity-0 animation-delay-200",
            isInView && "animate-fade-in"
          )}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Rechtliches</h4>
            <ul className="space-y-4">
              {["Datenschutzerklärung", "AGB", "Impressum", "Cookie-Richtlinie"].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(
            "opacity-0 animation-delay-300",
            isInView && "animate-fade-in"
          )}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li className="text-white/70 flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                <div>
                  <span className="block">WZW AG</span>
                  <span className="block">Zürich, Schweiz</span>
                </div>
              </li>
              <li>
                <a 
                  href="mailto:info@wzw.ch"
                  className="text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-3"
                >
                  <Mail className="w-5 h-5 text-secondary" />
                  info@wzw.ch
                </a>
              </li>
              <li>
                <a 
                  href="tel:+41123456789"
                  className="text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-3"
                >
                  <Phone className="w-5 h-5 text-secondary" />
                  +41 12 345 67 89
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={cn(
          "mt-16 pt-8 border-t border-white/20 text-center text-white/50 text-sm opacity-0 animation-delay-400",
          isInView && "animate-fade-in"
        )}>
          <p>© {new Date().getFullYear()} WZW AG. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
