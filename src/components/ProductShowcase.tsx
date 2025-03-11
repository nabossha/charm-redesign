
import { useRef, useState } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";

type Product = {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  features: string[];
};

const products: Product[] = [
  {
    id: 1,
    title: "Premium Product One",
    description: "An expertly crafted solution designed with meticulous attention to detail and uncompromising quality.",
    imageSrc: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1600&q=80",
    features: ["Exceptional detail", "Precision engineering", "Intuitive design"],
  },
  {
    id: 2,
    title: "Elegant Product Two",
    description: "A harmonious blend of form and function, creating an experience that's both beautiful and purposeful.",
    imageSrc: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&q=80",
    features: ["Seamless integration", "Refined aesthetics", "Enduring quality"],
  },
  {
    id: 3,
    title: "Innovative Product Three",
    description: "Breaking new ground with thoughtful innovation that solves real problems in elegant ways.",
    imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    features: ["Revolutionary approach", "Forward-thinking", "Sustainable design"],
  },
];

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 relative overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span 
            className={cn(
              "inline-block px-4 py-1.5 text-xs font-medium tracking-wide uppercase bg-secondary text-foreground/70 rounded-full mb-6 opacity-0",
              isInView && "animate-scale-in"
            )}
          >
            Our Products
          </span>
          <h2 
            className={cn(
              "text-4xl md:text-5xl font-medium mb-6 opacity-0",
              isInView && "animate-fade-in"
            )}
          >
            Designed with purpose
          </h2>
          <p 
            className={cn(
              "max-w-2xl mx-auto text-foreground/70 text-lg opacity-0 animation-delay-200",
              isInView && "animate-fade-in"
            )}
          >
            Each product we create is meticulously crafted to deliver outstanding 
            performance while maintaining an elegant, timeless design.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className={cn(
              "perspective opacity-0",
              isInView && "animate-fade-in animation-delay-300"
            )}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "rounded-2xl overflow-hidden transition-all duration-1000 ease-apple",
                  activeProduct === product.id
                    ? "opacity-100 transform-none"
                    : "opacity-0 absolute"
                )}
                style={{
                  display: activeProduct === product.id ? "block" : "none"
                }}
              >
                <div className="relative">
                  <img
                    src={product.imageSrc}
                    alt={product.title}
                    className="w-full h-[400px] object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                </div>
              </div>
            ))}
          </div>

          <div 
            className={cn(
              "flex flex-col opacity-0",
              isInView && "animate-fade-in animation-delay-400"
            )}
          >
            <div className="flex gap-3 mb-8">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setActiveProduct(product.id)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    activeProduct === product.id
                      ? "bg-foreground scale-125"
                      : "bg-foreground/30"
                  )}
                  aria-label={`View ${product.title}`}
                />
              ))}
            </div>

            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "transition-opacity duration-500 space-y-6",
                  activeProduct === product.id ? "opacity-100" : "opacity-0 hidden"
                )}
              >
                <h3 className="text-3xl font-medium">{product.title}</h3>
                <p className="text-foreground/70 text-lg">
                  {product.description}
                </p>
                <ul className="space-y-3 pt-4">
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <a
                    href="#"
                    className="px-6 py-3 inline-flex items-center bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors duration-300"
                  >
                    Explore {product.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
