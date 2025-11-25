export interface Product {
  id: string; // Sesuai dengan Supabase schema (text)
  name: string;
  price: string; // Format: "Rp10.000"
  isFeatured: boolean;
  category?: string;
  image?: string;
  description?: string;
  link?: string;
}

export interface ProductRaw {
  id: string;
  name: string;
  category: string;
  price: number; // Raw number dari database
  image: string | null;
  description: string | null;
  link: string;
  is_featured: boolean;
}
