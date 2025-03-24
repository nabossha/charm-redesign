
export interface PageContent {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  username: string | null;
}
