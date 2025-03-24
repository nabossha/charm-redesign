
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ArrowDown, ExternalLink, Mail } from "lucide-react";
import { PageContent } from "@/types/content";

interface HeroProps {
  content?: PageContent;
}

const Hero = ({ content }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { threshold: 0.1 });

  // Default content if not provided from database
  const title = content?.title || "Innovative Lösungen";
  const description = content?.description || "Wir schaffen massgeschneiderte Lösungen mit Präzision und Sorgfalt, und fokussieren uns auf das Wesentliche für Ihren Erfolg.";

  return (
    <section 
      ref={heroRef}
      className="min-h-screen relative flex flex-col items-center justify-center pt-20 overflow-hidden"
      id="hero"
    >
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 to-background"
        aria-hidden="true"
      ></div>
      
      <div 
        className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center"
      >
        <span 
          className={cn(
            "px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-muted text-secondary rounded-full mb-8 opacity-0",
            isInView && "animate-scale-in"
          )}
        >
          Willkommen bei WZW
        </span>
        
        <h1 
          className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance opacity-0",
            isInView && "animate-fade-in"
          )}
        >
          <span className="block text-primary">{title.split(' ')[0]}</span>
          <span className="block wzw-gradient-text">{title.split(' ').slice(1).join(' ')}</span>
        </h1>
        
        <p 
          className={cn(
            "max-w-2xl text-lg md:text-xl text-foreground/70 mb-12 text-balance opacity-0 animation-delay-200",
            isInView && "animate-fade-in"
          )}
        >
          {description}
        </p>
        
        <div 
          className={cn(
            "flex flex-col sm:flex-row gap-4 opacity-0 animation-delay-400",
            isInView && "animate-fade-in"
          )}
        >
          <a 
            href="#products" 
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-secondary transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Produkte entdecken
            <ExternalLink className="w-4 h-4" />
          </a>
          <a 
            href="#contact-form" 
            className="px-6 py-3 bg-transparent border border-primary/20 text-foreground rounded-full hover:bg-muted transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Kontakt aufnehmen
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-pulse-slow">
        <a 
          href="#about" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white wzw-shadow hover:shadow-lg transition-shadow duration-300"
          aria-label="Nach unten scrollen"
        >
          <ArrowDown className="w-5 h-5 text-primary" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
