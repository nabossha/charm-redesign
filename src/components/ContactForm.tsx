
import { useState, useRef } from "react";
import { useInView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://env-1205783.jcloud.ik-server.com/webhook/09446c0e-e728-4e28-a2ea-7eae106e3164", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      
      if (response.status === 200) {
        toast({
          title: "Nachricht gesendet",
          description: "Vielen Dank für Ihre Nachricht. Wir melden uns zeitnah bei Ihnen.",
        });
        
        // Reset form
        setName("");
        setEmail("");
        setMessage("");
        formRef.current?.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      className="py-16 md:py-24 px-6 bg-muted"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span 
            className={cn(
              "px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-secondary/10 text-secondary rounded-full mb-6 inline-block opacity-0",
              isInView && "animate-scale-in"
            )}
          >
            Kontakt
          </span>
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-bold mb-4 opacity-0",
              isInView && "animate-fade-in"
            )}
          >
            Nehmen Sie Kontakt mit uns auf
          </h2>
          <p 
            className={cn(
              "max-w-2xl mx-auto text-foreground/70 opacity-0 animation-delay-200",
              isInView && "animate-fade-in"
            )}
          >
            Haben Sie Fragen oder möchten Sie mehr über unsere Dienstleistungen erfahren? 
            Füllen Sie das Formular aus und wir setzen uns umgehend mit Ihnen in Verbindung.
          </p>
        </div>
        
        <div 
          className={cn(
            "max-w-xl mx-auto opacity-0 animation-delay-300", 
            isInView && "animate-fade-in"
          )}
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white rounded-lg p-8 shadow-sm border border-border"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Name / Vorname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ihr Name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                E-Mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="ihre@email.ch"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                Nachricht <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                placeholder="Ihre Nachricht..."
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300 flex items-center justify-center gap-2",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Absenden</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
