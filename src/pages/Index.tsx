
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import Features from "@/components/Features";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { fetchPageContent, fetchProducts, fetchFeatures } from "@/services/contentService";
import { PageContent, Product, Feature } from "@/types/content";

const Index = () => {
  // Fetch content data
  const { data: pageContent = {} } = useQuery<Record<string, PageContent>>({
    queryKey: ['pageContent'],
    queryFn: fetchPageContent,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: features = [] } = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  });

  useEffect(() => {
    // Smooth scroll initialization
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      const element = document.querySelector(href);
      if (!element) return;
      
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth'
      });
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero content={pageContent['hero']} />
        
        <section id="about" className="py-24 md:py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wide uppercase bg-secondary text-foreground/70 rounded-full mb-6">
                  About Us
                </span>
                <h2 className="text-4xl md:text-5xl font-medium mb-6">
                  {pageContent['about']?.title || "We create beauty through simplicity"}
                </h2>
                <p className="text-foreground/70 text-lg mb-8">
                  {pageContent['about']?.description || "At XYZ, we believe that the best designs are those that seamlessly blend form and function, creating experiences that feel intuitive and natural. Our approach focuses on reducing complexity and celebrating the essential."}
                </p>
                <p className="text-foreground/70 text-lg">
                  Every product we create is the result of meticulous attention 
                  to detail, tireless refinement, and a commitment to excellence 
                  that permeates our entire process. We don't just create products; 
                  we craft experiences that enhance life.
                </p>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl overflow-hidden">
                  <img 
                    src={pageContent['about']?.image_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80"} 
                    alt="Design Process" 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-secondary rounded-2xl -z-10"></div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white shadow-sm rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        <ProductShowcase 
          sectionContent={pageContent['products']} 
          products={products} 
        />
        
        <Features 
          sectionContent={pageContent['features']} 
          features={features} 
        />
        
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
