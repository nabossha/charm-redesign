
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeatures, updateFeature, createFeature, deleteFeature } from "@/services/contentService";
import { Feature } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Save, Plus, Trash, Users, Check, Zap, Clock, BarChart, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const AVAILABLE_ICONS = [
  { name: 'Users', icon: <Users className="h-5 w-5" /> },
  { name: 'Check', icon: <Check className="h-5 w-5" /> },
  { name: 'Zap', icon: <Zap className="h-5 w-5" /> },
  { name: 'Clock', icon: <Clock className="h-5 w-5" /> },
  { name: 'BarChart', icon: <BarChart className="h-5 w-5" /> },
  { name: 'Shield', icon: <Shield className="h-5 w-5" /> },
];

const FeatureEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("Users");
  
  const { data: features = [], isLoading } = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  });
  
  const form = useForm<Partial<Feature>>({
    defaultValues: selectedFeature || {
      title: "",
      description: "",
      icon: "Users",
    },
  });
  
  // Update form values when selected feature changes
  useState(() => {
    if (selectedFeature) {
      form.reset(selectedFeature);
      setSelectedIcon(selectedFeature.icon);
    } else {
      form.reset({
        title: "",
        description: "",
        icon: "Users",
      });
      setSelectedIcon("Users");
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: updateFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({
        title: "Änderungen gespeichert",
        description: "Das Feature wurde erfolgreich aktualisiert.",
      });
      setSelectedFeature(null);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
      console.error("Error updating feature:", error);
    },
  });
  
  const createMutation = useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({
        title: "Feature erstellt",
        description: "Das neue Feature wurde erfolgreich erstellt.",
      });
      setIsCreating(false);
      form.reset({
        title: "",
        description: "",
        icon: "Users",
      });
      setSelectedIcon("Users");
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Das Feature konnte nicht erstellt werden.",
        variant: "destructive",
      });
      console.error("Error creating feature:", error);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({
        title: "Feature gelöscht",
        description: "Das Feature wurde erfolgreich gelöscht.",
      });
      setSelectedFeature(null);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Das Feature konnte nicht gelöscht werden.",
        variant: "destructive",
      });
      console.error("Error deleting feature:", error);
    },
  });
  
  const onSubmit = async (data: Partial<Feature>) => {
    const featureData = {
      ...data,
      icon: selectedIcon,
    };
    
    if (isCreating) {
      await createMutation.mutateAsync(featureData as any);
    } else if (selectedFeature) {
      await updateMutation.mutateAsync({
        ...featureData,
        id: selectedFeature.id,
      } as any);
    }
  };
  
  const handleDeleteFeature = async (id: string) => {
    await deleteMutation.mutateAsync(id);
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
            <CardTitle>Features</CardTitle>
            <CardDescription>Verwalten Sie Ihre Features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Neues Feature
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <div className="flex flex-col space-y-2 mt-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between">
                    <Button
                      variant={selectedFeature?.id === feature.id ? "default" : "outline"}
                      className="justify-start flex-1 text-left"
                      onClick={() => {
                        setSelectedFeature(feature);
                        form.reset(feature);
                        setSelectedIcon(feature.icon);
                        setIsCreating(false);
                      }}
                    >
                      {feature.title}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Feature löschen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie dieses Feature wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteFeature(feature.id)}
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
              {isCreating ? "Neues Feature erstellen" : selectedFeature ? `Feature bearbeiten: ${selectedFeature.title}` : "Feature Bearbeiten"}
            </CardTitle>
            <CardDescription>
              {isCreating ? "Erstellen Sie ein neues Feature" : "Ändern Sie die Details des ausgewählten Features"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(isCreating || selectedFeature) ? (
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
                  
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormDescription>
                      Wählen Sie ein Icon für dieses Feature
                    </FormDescription>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {AVAILABLE_ICONS.map((icon) => (
                        <Button
                          key={icon.name}
                          type="button"
                          variant={selectedIcon === icon.name ? "default" : "outline"}
                          className="h-16 flex flex-col gap-2"
                          onClick={() => setSelectedIcon(icon.name)}
                        >
                          <div className="flex items-center justify-center">
                            {icon.icon}
                          </div>
                          <span className="text-xs">{icon.name}</span>
                        </Button>
                      ))}
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
                          setSelectedFeature(null);
                        }
                        form.reset();
                        setSelectedIcon("Users");
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
                Bitte wählen Sie ein Feature aus oder erstellen Sie ein neues.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog for creating new feature */}
      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Neues Feature erstellen</DialogTitle>
              <DialogDescription>
                Erstellen Sie ein neues Feature für Ihre Website.
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
                
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormDescription>
                    Wählen Sie ein Icon für dieses Feature
                  </FormDescription>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {AVAILABLE_ICONS.map((icon) => (
                      <Button
                        key={icon.name}
                        type="button"
                        variant={selectedIcon === icon.name ? "default" : "outline"}
                        className="h-16 flex flex-col gap-2"
                        onClick={() => setSelectedIcon(icon.name)}
                      >
                        <div className="flex items-center justify-center">
                          {icon.icon}
                        </div>
                        <span className="text-xs">{icon.name}</span>
                      </Button>
                    ))}
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
                  setSelectedIcon("Users");
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

export default FeatureEditor;
