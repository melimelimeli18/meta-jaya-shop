'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import HeroForm from '@/app/sections/admin/edit-hero/HeroForm';
import HeroPreview from '@/app/sections/admin/edit-hero/HeroPreview';

interface HeroData {
  image: string | File;
  headline: string;
  subHeadline: string;
}

// data dummy
const INITIAL_HERO_DATA: HeroData = {
  image: '/images/placeholder.png',
  headline: 'Selamat Datang di MetaJaya Shop',
  subHeadline: 'Toko Audio Profesional Terlengkap di Indonesia',
};

export default function EditHeroPage() {
  const [heroData, setHeroData] = useState<HeroData>(INITIAL_HERO_DATA);
  const [previewData, setPreviewData] = useState<HeroData>(INITIAL_HERO_DATA);

  const handleSubmit = (data: HeroData) => {
    const imageUrl = data.image instanceof File 
      ? URL.createObjectURL(data.image) 
      : data.image;

    const updatedData = {
      ...data,
      image: imageUrl,
    };

    setHeroData(updatedData);
    setPreviewData(updatedData);
    
    alert('Hero section berhasil diupdate!');
    
    console.log('Saving hero data:', data);
  };

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">Edit Hero Section</h2>
      
      <div className="row g-4">
        <div className="col-md-6">
          <HeroForm 
            initialData={heroData}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="col-md-6">
          <HeroPreview
            image={typeof previewData.image === 'string' ? previewData.image : '/images/placeholder.png'}
            headline={previewData.headline}
            subHeadline={previewData.subHeadline}
          />
        </div>
      </div>
    </Container>
  );
}