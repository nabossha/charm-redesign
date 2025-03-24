
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, updateProduct, createProduct, deleteProduct } from "@/services/contentService";
import { Product } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Save, Plus, Trash, Edit, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const ProductEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  
  const form = useForm<Partial<Product>>({
    defaultValues: selectedProduct || {
      title: "",
      description: "",
      image_url: "",
      features: [],
    },
  });
  
  // Update form values when selected product changes
  useState(() => {
    if (selectedProduct) {
      form.reset(selectedProduct);
      setFeatures(selectedProduct.features || []);
    } else {
      form.reset({
        title: "",
        description: "",
        image_url: "",
      });
      setFeatures([]);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Änderungen gespeichert",
        description: "Das Produkt wurde erfolgreich aktualisiert.",
      });
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
      console.error("Error updating product:", error);
    },
  });
  
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produkt erstellt",
        description: "Das neue Produkt wurde erfolgreich erstellt.",
      });
      setIsCreating(false);
      form.reset({
        title: "",
        description: "",
        image_url: "",
      });
      setFeatures([]);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Das Produkt konnte nicht erstellt werden.",
        variant: "destructive",
      });
      console.error("Error creating product:", error);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produkt gelöscht",
        description: "Das Produkt wurde erfolgreich gelöscht.",
      });
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Das Produkt konnte nicht gelöscht werden.",
        variant: "destructive",
      });
      console.error("Error deleting product:", error);
    },
  });
  
  const onSubmit = async (data: Partial<Product>) => {
    const productData = {
      ...data,
      features: features,
    };
    
    if (isCreating) {
      await createMutation.mutateAsync(productData as any);
    } else if (selectedProduct) {
      await updateMutation.mutateAsync({
        ...productData,
        id: selectedProduct.id,
      } as any);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };
  
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };
  
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Produkte</CardTitle>
            <CardDescription>Verwalten Sie Ihre Produkte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Neues Produkt
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <div className="flex flex-col space-y-2 mt-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <Button
                      variant={selectedProduct?.id === product.id ? "default" : "outline"}
                      className="justify-start flex-1 text-left"
                      onClick={() => {
                        setSelectedProduct(product);
                        form.reset(product);
                        setFeatures(product.features || []);
                        setIsCreating(false);
                      }}
                    >
                      {product.title}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Produkt löschen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? "Neues Produkt erstellen" : selectedProduct ? `Produkt bearbeiten: ${selectedProduct.title}` : "Produkt Bearbeiten"}
            </CardTitle>
            <CardDescription>
              {isCreating ? "Erstellen Sie ein neues Produkt" : "Ändern Sie die Details des ausgewählten Produkts"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(isCreating || selectedProduct) ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titel</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beschreibung</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bild URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          Geben Sie die vollständige URL zu einem Bild ein
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Neues Feature hinzufügen"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeature();
                            }
                          }}
                        />
                        <Button type="button" onClick={addFeature}>
                          Hinzufügen
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                            <span className="flex-1">{feature}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFeature(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormItem>
                  
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (isCreating) {
                          setIsCreating(false);
                        } else {
                          setSelectedProduct(null);
                        }
                        form.reset();
                        setFeatures([]);
                      }}
                    >
                      Abbrechen
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={updateMutation.isPending || createMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      {updateMutation.isPending || createMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Speichern...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {isCreating ? "Erstellen" : "Änderungen speichern"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                Bitte wählen Sie ein Produkt aus oder erstellen Sie ein neues.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog for creating new product */}
      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Neues Produkt erstellen</DialogTitle>
              <DialogDescription>
                Erstellen Sie ein neues Produkt für Ihre Website.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titel</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bild URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Geben Sie die vollständige URL zu einem Bild ein
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Neues Feature hinzufügen"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={addFeature}>
                        Hinzufügen
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                          <span className="flex-1">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormItem>
              </form>
            </Form>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  form.reset();
                  setFeatures([]);
                }}
              >
                Abbrechen
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Erstellen...
                  </>
                ) : (
                  "Erstellen"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductEditor;
