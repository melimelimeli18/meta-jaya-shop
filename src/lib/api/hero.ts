// lib/api/hero.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface HeroData {
  id?: string;
  headline: string;
  sub_headline: string;
  banner_image_url: string | null;
  is_active?: boolean;
}

export const heroAPI = {
  // GET - Ambil data hero
  async getHero(): Promise<HeroData> {
    const response = await fetch(`${API_BASE_URL}/hero`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hero data');
    }

    const result = await response.json();
    return result.data;
  },

  // PUT - Update hero (headline & sub_headline)
  async updateHero(data: {
    headline: string;
    sub_headline: string;
    banner_image_url?: string;
  }): Promise<HeroData> {
    const response = await fetch(`${API_BASE_URL}/hero`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update hero data');
    }

    const result = await response.json();
    return result.data;
  },

  // POST - Upload banner image
  async uploadBanner(file: File): Promise<{ url: string; hero: HeroData }> {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await fetch(`${API_BASE_URL}/hero/upload-banner`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload banner');
    }

    const result = await response.json();
    return result.data;
  },
};