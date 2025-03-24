
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeatures, updateFeature, createFeature, deleteFeature, reorderFeatures } from "@/services/contentService";
import { Feature } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Save, Plus, Trash, Users, Check, Zap, Clock, BarChart, Shield, GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

// Import React DND library
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AVAILABLE_ICONS = [
  { name: 'Users', icon: <Users className="h-5 w-5" /> },
  { name: 'Check', icon: <Check className="h-5 w-5" /> },
  { name: 'Zap', icon: <Zap className="h-5 w-5" /> },
  { name: 'Clock', icon: <Clock className="h-5 w-5" /> },
  { name: 'BarChart', icon: <BarChart className="h-5 w-5" /> },
  { name: 'Shield', icon: <Shield className="h-5 w-5" /> },
];

// Sortable Feature Item Component
const SortableFeatureItem = ({ feature, isSelected, onSelect, onDelete }: { 
  feature: Feature; 
  isSelected: boolean; 
  onSelect: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: feature.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 mb-2">
      <div 
        className="cursor-grab hover:text-primary touch-none" 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <Button
        variant={isSelected ? "default" : "outline"}
        className="justify-start flex-1 text-left"
        onClick={onSelect}
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
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const FeatureEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("Users");
  const [featureList, setFeatureList] = useState<Feature[]>([]);
  
  // Set up DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const { data: features = [], isLoading } = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  });
  
  // Update local state when features data changes
  useEffect(() => {
    setFeatureList(features);
  }, [features]);
  
  const form = useForm<Partial<Feature>>({
    defaultValues: {
      title: "",
      description: "",
      icon: "Users",
    },
  });
  
  // Update form values when selected feature changes
  useEffect(() => {
    if (selectedFeature) {
      form.reset(selectedFeature);
      setSelectedIcon(selectedFeature.icon);
    } else if (!isCreating) {
      form.reset({
        title: "",
        description: "",
        icon: "Users",
      });
      setSelectedIcon("Users");
    }
  }, [selectedFeature, form, isCreating]);
  
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
  
  const reorderMutation = useMutation({
    mutationFn: reorderFeatures,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({
        title: "Reihenfolge aktualisiert",
        description: "Die Reihenfolge der Features wurde erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Reihenfolge konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
      console.error("Error reordering features:", error);
      // Revert to original order
      queryClient.invalidateQueries({ queryKey: ['features'] });
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
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = featureList.findIndex((item) => item.id === active.id);
      const newIndex = featureList.findIndex((item) => item.id === over.id);
      
      const newFeatureList = arrayMove(featureList, oldIndex, newIndex);
      setFeatureList(newFeatureList);
      
      // Save new order to database
      const orderedIds = newFeatureList.map(item => item.id);
      reorderMutation.mutate(orderedIds);
    }
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
              <Button
                className="w-full"
                onClick={() => {
                  setIsCreating(true);
                  setSelectedFeature(null);
                  form.reset({
                    title: "",
                    description: "",
                    icon: "Users",
                  });
                  setSelectedIcon("Users");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Neues Feature
              </Button>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Drag & Drop zum Sortieren</p>
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={featureList.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    {featureList.map((feature) => (
                      <SortableFeatureItem
                        key={feature.id}
                        feature={feature}
                        isSelected={selectedFeature?.id === feature.id}
                        onSelect={() => {
                          setSelectedFeature(feature);
                          setIsCreating(false);
                        }}
                        onDelete={() => handleDeleteFeature(feature.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
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
                        form.reset({
                          title: "",
                          description: "",
                          icon: "Users",
                        });
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
    </div>
  );
};

export default FeatureEditor;
