
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { threshold: 0.1 });

  return (
    <section 
      ref={heroRef}
      className="min-h-screen relative flex flex-col items-center justify-center pt-20 overflow-hidden"
      id="hero"
    >
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/30 to-background"
        aria-hidden="true"
      ></div>
      
      <div 
        className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center"
      >
        <span 
          className={cn(
            "px-4 py-1.5 text-xs font-medium tracking-wide uppercase bg-secondary text-foreground/70 rounded-full mb-8 opacity-0",
            isInView && "animate-scale-in"
          )}
        >
          Introducing
        </span>
        
        <h1 
          className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 text-balance opacity-0",
            isInView && "animate-fade-in"
          )}
        >
          <span className="block">Design that</span>
          <span className="block">inspires creation</span>
        </h1>
        
        <p 
          className={cn(
            "max-w-2xl text-lg md:text-xl text-foreground/70 mb-12 text-balance opacity-0 animation-delay-200",
            isInView && "animate-fade-in"
          )}
        >
          We create beautiful, functional solutions with precision and care, 
          embracing simplicity and focusing on what truly matters.
        </p>
        
        <div 
          className={cn(
            "flex flex-col sm:flex-row gap-4 opacity-0 animation-delay-400",
            isInView && "animate-fade-in"
          )}
        >
          <a 
            href="#products" 
            className="px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors duration-300"
          >
            Explore Products
          </a>
          <a 
            href="#features" 
            className="px-6 py-3 bg-transparent border border-foreground/20 text-foreground rounded-full hover:bg-secondary transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-pulse-slow">
        <a 
          href="#about" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
