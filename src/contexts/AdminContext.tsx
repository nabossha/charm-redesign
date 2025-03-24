
import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuth } from "@/types/content";
import { useToast } from "@/components/ui/use-toast";

interface AdminContextProps {
  admin: AdminAuth;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminAuth>({
    isAuthenticated: false,
    username: null,
  });
  const { toast } = useToast();

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('authenticate_admin', {
        username_input: username,
        password_input: password,
      });

      if (error) {
        console.error('Error logging in:', error);
        toast({
          title: "Login fehlgeschlagen",
          description: "Benutzername oder Passwort ungültig.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setAdmin({
          isAuthenticated: true,
          username: username,
        });
        
        // Store auth in localStorage
        localStorage.setItem('adminAuth', JSON.stringify({
          isAuthenticated: true,
          username: username,
        }));
        
        return true;
      } else {
        toast({
          title: "Login fehlgeschlagen",
          description: "Benutzername oder Passwort ungültig.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Ein Fehler ist aufgetreten",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setAdmin({
      isAuthenticated: false,
      username: null,
    });
    localStorage.removeItem('adminAuth');
  };

  // Check for existing auth on mount
  useState(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      setAdmin(JSON.parse(storedAuth));
    }
  });

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
