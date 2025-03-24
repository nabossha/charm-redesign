
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-16 border-t border-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Über uns</h4>
            <p className="text-foreground/70">
              Wir entwickeln innovative Lösungen mit Präzision und Sorgfalt,
              und fokussieren uns auf das Wesentliche für Ihren Erfolg.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kontakt</h4>
            <p className="text-foreground/70">
              Musterstrasse 123<br />
              8000 Zürich<br />
              Schweiz
            </p>
            <p className="text-foreground/70">
              <a href="mailto:info@example.com" className="hover:text-primary">info@example.com</a><br />
              <a href="tel:+41441234567" className="hover:text-primary">+41 44 123 45 67</a>
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#products" className="text-foreground/70 hover:text-primary">Produkte</a>
              </li>
              <li>
                <a href="#features" className="text-foreground/70 hover:text-primary">Features</a>
              </li>
              <li>
                <a href="#contact-form" className="text-foreground/70 hover:text-primary">Kontakt</a>
              </li>
              <li>
                <Link to="/admin" className="text-foreground/70 hover:text-primary">Admin</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted-foreground/20 mt-12 pt-8 text-center text-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} WZW. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
