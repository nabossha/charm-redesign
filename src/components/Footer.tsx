
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { threshold: 0.1 });

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="py-16 md:py-24 px-6 bg-foreground text-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className={cn(
            "opacity-0",
            isInView && "animate-fade-in"
          )}>
            <h3 className="text-2xl font-medium mb-6">WZW</h3>
            <p className="text-background/70 mb-6">
              Creating thoughtful solutions with precision and care, embracing
              simplicity and focusing on what truly matters.
            </p>
          </div>

          <div className={cn(
            "opacity-0 animation-delay-100",
            isInView && "animate-fade-in"
          )}>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Navigation</h4>
            <ul className="space-y-4">
              {["About", "Products", "Features", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-background/70 hover:text-background transition-colors duration-300"
                  >
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
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Impressum"].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="text-background/70 hover:text-background transition-colors duration-300"
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
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="text-background/70">
                <span className="block">WZW Innovations</span>
                <span className="block">Zurich, Switzerland</span>
              </li>
              <li>
                <a 
                  href="mailto:info@wzw.ch"
                  className="text-background/70 hover:text-background transition-colors duration-300"
                >
                  info@wzw.ch
                </a>
              </li>
              <li>
                <a 
                  href="tel:+41123456789"
                  className="text-background/70 hover:text-background transition-colors duration-300"
                >
                  +41 12 345 67 89
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={cn(
          "mt-16 pt-8 border-t border-background/20 text-center text-background/50 text-sm opacity-0 animation-delay-400",
          isInView && "animate-fade-in"
        )}>
          <p>© {new Date().getFullYear()} WZW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
