
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Website
          </Button>
          
          {admin.isAuthenticated && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Admin: {admin.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
              >
                Abmelden
              </Button>
            </div>
          )}
        </div>

        {!admin.isAuthenticated ? (
          <div className="max-w-md mx-auto my-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
              <LoginForm />
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
};

export default Admin;
