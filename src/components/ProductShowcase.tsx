
import { useRef, useState } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Product, PageContent } from "@/types/content";

interface ProductShowcaseProps {
  sectionContent?: PageContent;
  products?: Product[];
}

const ProductShowcase = ({ sectionContent, products = [] }: ProductShowcaseProps) => {
  const [activeProduct, setActiveProduct] = useState<string | number>(products[0]?.id || 1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  // Default content if not provided from database
  const title = sectionContent?.title || "Mit Präzision entwickelt";
  const description = sectionContent?.description || "Jedes von uns geschaffene Produkt ist sorgfältig gefertigt, um aussergewöhnliche Leistung zu liefern und gleichzeitig ein elegantes, zeitloses Design beizubehalten.";

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
              "inline-block px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-muted text-secondary rounded-full mb-6 opacity-0",
              isInView && "animate-scale-in"
            )}
          >
            Unsere Produkte
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

        {products.length > 0 && (
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
                    "rounded-2xl overflow-hidden transition-all duration-1000 ease-apple wzw-shadow",
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
                      src={product.image_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1600&q=80"}
                      alt={product.title}
                      className="w-full h-[400px] object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-60"></div>
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
                        ? "bg-secondary scale-125"
                        : "bg-foreground/30"
                    )}
                    aria-label={`${product.title} anzeigen`}
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
                  <h3 className="text-3xl font-bold text-primary">{product.title}</h3>
                  <p className="text-foreground/70 text-lg">
                    {product.description}
                  </p>
                  <ul className="space-y-3 pt-4">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3"
                      >
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-secondary">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6">
                    <a
                      href="#"
                      className="px-6 py-3 inline-flex items-center bg-primary text-white rounded-full hover:bg-secondary transition-colors duration-300 gap-2"
                    >
                      {product.title} entdecken
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
