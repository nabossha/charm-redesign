
import { supabase } from "@/integrations/supabase/client";
import { PageContent, Product, Feature } from "@/types/content";

export const fetchPageContent = async (): Promise<Record<string, PageContent>> => {
  const { data, error } = await supabase
    .from('page_content')
    .select('*');
  
  if (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }

  // Convert array to object with section_id as key
  return (data || []).reduce((acc, item) => {
    acc[item.section_id] = item;
    return acc;
  }, {} as Record<string, PageContent>);
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

export const fetchFeatures = async (): Promise<Feature[]> => {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching features:', error);
    throw error;
  }

  return data || [];
};

// Admin functions to update content
export const updatePageContent = async (content: Partial<PageContent>): Promise<PageContent> => {
  const { data, error } = await supabase
    .from('page_content')
    .update(content)
    .eq('section_id', content.section_id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating page content:', error);
    throw error;
  }

  return data;
};

export const updateProduct = async (product: Partial<Product> & { id: string }): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', product.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  // Get the maximum position value
  const { data: maxPositionData } = await supabase
    .from('products')
    .select('position')
    .order('position', { ascending: false })
    .limit(1);
  
  const maxPosition = maxPositionData && maxPositionData.length > 0 ? maxPositionData[0].position || 0 : 0;
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      position: maxPosition + 1
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const updateFeature = async (feature: Partial<Feature> & { id: string }): Promise<Feature> => {
  const { data, error } = await supabase
    .from('features')
    .update(feature)
    .eq('id', feature.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating feature:', error);
    throw error;
  }

  return data;
};

export const createFeature = async (feature: Omit<Feature, 'id' | 'created_at' | 'updated_at'>): Promise<Feature> => {
  // Get the maximum position value
  const { data: maxPositionData } = await supabase
    .from('features')
    .select('position')
    .order('position', { ascending: false })
    .limit(1);
  
  const maxPosition = maxPositionData && maxPositionData.length > 0 ? maxPositionData[0].position || 0 : 0;
  
  const { data, error } = await supabase
    .from('features')
    .insert({
      ...feature,
      position: maxPosition + 1
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating feature:', error);
    throw error;
  }

  return data;
};

export const deleteFeature = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('features')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting feature:', error);
    throw error;
  }
};

export const reorderFeatures = async (orderedIds: string[]): Promise<void> => {
  // Update each feature with its new position
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('features')
      .update({ position: i + 1 })
      .eq('id', orderedIds[i]);
    
    if (error) {
      console.error(`Error updating position for feature ${orderedIds[i]}:`, error);
      throw error;
    }
  }
};

export const reorderProducts = async (orderedIds: string[]): Promise<void> => {
  // Update each product with its new position
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('products')
      .update({ position: i + 1 })
      .eq('id', orderedIds[i]);
    
    if (error) {
      console.error(`Error updating position for product ${orderedIds[i]}:`, error);
      throw error;
    }
  }
};
