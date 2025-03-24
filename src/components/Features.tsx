
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Check, Clock, Shield, Zap, BarChart, Users } from "lucide-react";
import { Feature, PageContent } from "@/types/content";

// Map of icon names to components
const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5" />,
  Check: <Check className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  BarChart: <BarChart className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

interface FeaturesProps {
  sectionContent?: PageContent;
  features?: Feature[];
}

const Features = ({ sectionContent, features = [] }: FeaturesProps) => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { threshold: 0.1 });

  // Default content if not provided from database
  const title = sectionContent?.title || "Leistungen die zählen";
  const description = sectionContent?.description || "Wir konzentrieren uns auf das Wesentliche und eliminieren das Unnötige, um Erlebnisse zu schaffen, die sowohl schön als auch funktional sind.";

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
            {title}
          </h2>
          <p 
            className={cn(
              "max-w-2xl mx-auto text-foreground/70 text-lg opacity-0 animation-delay-200",
              isInView && "animate-fade-in"
            )}
          >
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cn(
                "bg-white p-8 rounded-2xl wzw-shadow hover-lift opacity-0",
                `animation-delay-${(index + 1) * 100}`,
                isInView && "animate-fade-in"
              )}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full wzw-gradient text-white mb-6">
                {iconMap[feature.icon] || <Check className="w-5 h-5" />}
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
