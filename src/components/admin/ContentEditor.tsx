
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPageContent, updatePageContent } from "@/services/contentService";
import { PageContent } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const ContentEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  const { data: content = {}, isLoading } = useQuery<Record<string, PageContent>>({
    queryKey: ['pageContent'],
    queryFn: fetchPageContent,
  });
  
  const selectedContent = selectedSection ? content[selectedSection] : null;
  
  const form = useForm<Partial<PageContent>>({
    defaultValues: selectedContent || {
      title: "",
      description: "",
      image_url: "",
    },
  });
  
  // Update form values when selected section changes
  useState(() => {
    if (selectedContent) {
      form.reset(selectedContent);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: updatePageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageContent'] });
      toast({
        title: "Änderungen gespeichert",
        description: "Die Inhalte wurden erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
      console.error("Error updating content:", error);
    },
  });
  
  const onSubmit = async (data: Partial<PageContent>) => {
    if (!selectedSection) return;
    
    await updateMutation.mutateAsync({
      ...data,
      section_id: selectedSection,
    });
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
            <CardTitle>Sektionen</CardTitle>
            <CardDescription>Wählen Sie eine Sektion zum Bearbeiten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {Object.keys(content).map((sectionId) => (
                <Button
                  key={sectionId}
                  variant={selectedSection === sectionId ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    setSelectedSection(sectionId);
                    form.reset(content[sectionId]);
                  }}
                >
                  {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-3">
        {selectedSection ? (
          <Card>
            <CardHeader>
              <CardTitle>Sektion bearbeiten: {selectedSection}</CardTitle>
              <CardDescription>Ändern Sie die Inhalte dieser Sektion</CardDescription>
            </CardHeader>
            <CardContent>
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
                  
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Änderungen speichern
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-12">
                Bitte wählen Sie eine Sektion aus dem Menü auf der linken Seite.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
