// src/lib/api/products.ts

import { getApiUrl } from "./config";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sold?: number;
  image: string | null;
  description: string;
  link: string;
}

export interface ProductCreateData {
  name: string;
  price: number;
  category: string;
  link: string;
  description: string;
  image?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  error?: string;
}

/**
 * Products API Client
 */
export class ProductsAPI {
  /**
   * Get all products
   */
  static async getAll(): Promise<ApiResponse<Product[]>> {
    const response = await fetch(getApiUrl("/products"));
    return response.json();
  }

  /**
   * Get single product by ID
   */
  static async getById(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(getApiUrl(`/products/${id}`));
    return response.json();
  }

  /**
   * Create new product
   */
  static async create(data: ProductCreateData): Promise<ApiResponse<Product>> {
    const response = await fetch(getApiUrl("/products"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Update product by ID
   */
  static async update(
    id: string,
    data: Partial<ProductCreateData>
  ): Promise<ApiResponse<Product>> {
    const response = await fetch(getApiUrl(`/products/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Delete product by ID
   */
  static async delete(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(getApiUrl(`/products/${id}`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
}
