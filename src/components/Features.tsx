
import { useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Intuitive Design",
    description: "Our solutions are crafted with the user in mind, ensuring an effortless and natural experience.",
    delay: "animation-delay-100",
  },
  {
    title: "Meticulous Craftsmanship",
    description: "Every detail is carefully considered and refined to create products of exceptional quality.",
    delay: "animation-delay-200",
  },
  {
    title: "Purposeful Innovation",
    description: "We embrace new technologies and approaches that genuinely enhance the user experience.",
    delay: "animation-delay-300",
  },
  {
    title: "Timeless Aesthetic",
    description: "Our designs transcend trends, focusing on clarity and elegance that endures.",
    delay: "animation-delay-400",
  },
  {
    title: "Seamless Integration",
    description: "Our products work harmoniously together, creating a cohesive and unified experience.",
    delay: "animation-delay-500",
  },
  {
    title: "Sustainable Approach",
    description: "We design with longevity in mind, creating products that last and minimize environmental impact.",
    delay: "animation-delay-600",
  },
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { threshold: 0.1 });

  return (
    <section
      id="features"
      ref={featuresRef}
      className="py-24 md:py-32 px-6 relative overflow-hidden bg-secondary/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span 
            className={cn(
              "inline-block px-4 py-1.5 text-xs font-medium tracking-wide uppercase bg-white text-foreground/70 rounded-full mb-6 opacity-0",
              isInView && "animate-scale-in"
            )}
          >
            Our Approach
          </span>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-medium mb-6 opacity-0",
              isInView && "animate-fade-in"
            )}
          >
            Features that matter
          </h2>
          <p 
            className={cn(
              "max-w-2xl mx-auto text-foreground/70 text-lg opacity-0 animation-delay-200",
              isInView && "animate-fade-in"
            )}
          >
            We focus on the essential, eliminating the unnecessary to create 
            experiences that are both beautiful and functional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "bg-white p-8 rounded-2xl shadow-sm hover-lift opacity-0",
                feature.delay,
                isInView && "animate-fade-in"
              )}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary mb-6">
                <span className="text-xl font-medium">{index + 1}</span>
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
