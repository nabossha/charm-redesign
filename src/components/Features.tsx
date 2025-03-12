
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Check, Clock, Shield, Zap, BarChart, Users } from "lucide-react";

const features = [
  {
    title: "Intuitive Benutzererfahrung",
    description: "Unsere Lösungen sind benutzerfreundlich gestaltet und garantieren ein natürliches Erlebnis.",
    delay: "animation-delay-100",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Präzise Handwerkskunst",
    description: "Jedes Detail wird sorgfältig überlegt und verfeinert, um Produkte von aussergewöhnlicher Qualität zu schaffen.",
    delay: "animation-delay-200",
    icon: <Check className="w-5 h-5" />,
  },
  {
    title: "Zielgerichtete Innovation",
    description: "Wir setzen auf neue Technologien und Ansätze, die das Benutzererlebnis tatsächlich verbessern.",
    delay: "animation-delay-300",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Zeitlose Ästhetik",
    description: "Unser Design überdauert Trends und konzentriert sich auf Klarheit und dauerhafte Eleganz.",
    delay: "animation-delay-400",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: "Nahtlose Integration",
    description: "Unsere Produkte arbeiten harmonisch zusammen und schaffen ein kohärentes und einheitliches Erlebnis.",
    delay: "animation-delay-500",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    title: "Nachhaltiger Ansatz",
    description: "Wir gestalten mit Langlebigkeit im Blick und schaffen Produkte, die lange halten und die Umweltbelastung minimieren.",
    delay: "animation-delay-600",
    icon: <Shield className="w-5 h-5" />,
  },
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { threshold: 0.1 });

  return (
    <section
      id="features"
      ref={featuresRef}
      className="py-24 md:py-32 px-6 relative overflow-hidden bg-muted/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span 
            className={cn(
              "inline-block px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-white text-secondary rounded-full mb-6 opacity-0",
              isInView && "animate-scale-in"
            )}
          >
            Unser Ansatz
          </span>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-bold mb-6 opacity-0 text-primary",
              isInView && "animate-fade-in"
            )}
          >
            Leistungen die zählen
          </h2>
          <p 
            className={cn(
              "max-w-2xl mx-auto text-foreground/70 text-lg opacity-0 animation-delay-200",
              isInView && "animate-fade-in"
            )}
          >
            Wir konzentrieren uns auf das Wesentliche und eliminieren das Unnötige, 
            um Erlebnisse zu schaffen, die sowohl schön als auch funktional sind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "bg-white p-8 rounded-2xl wzw-shadow hover-lift opacity-0",
                feature.delay,
                isInView && "animate-fade-in"
              )}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full wzw-gradient text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
