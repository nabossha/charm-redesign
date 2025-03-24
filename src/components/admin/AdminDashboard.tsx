
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentEditor from "./ContentEditor";
import ProductEditor from "./ProductEditor";
import FeatureEditor from "./FeatureEditor";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
          <TabsTrigger value="content">Seitentexte</TabsTrigger>
          <TabsTrigger value="products">Produkte</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <ContentEditor />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <ProductEditor />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <FeatureEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
