// admin/edit-hero/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import HeroForm from "@/src/app/sections/admin/edit-hero/HeroForm";
import HeroPreview from "@/src/app/sections/admin/edit-hero/HeroPreview";
import { heroAPI } from "@/src/lib/api/hero";

interface HeroData {
  image: string | File;
  headline: string;
  subHeadline: string;
}

export default function EditHeroPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    image: "/images/placeholder.png",
    headline: "",
    subHeadline: "",
  });
  const [previewData, setPreviewData] = useState<HeroData>({
    image: "/images/placeholder.png",
    headline: "",
    subHeadline: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch data dari backend saat component mount
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await heroAPI.getHero();
        const initialData: HeroData = {
          image: data.banner_image_url || "/images/placeholder.png",
          headline: data.headline,
          subHeadline: data.sub_headline,
        };
        setHeroData(initialData);
        setPreviewData(initialData);
      } catch (error) {
        console.error("Error fetching hero:", error);
        alert("Gagal memuat data hero section");
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  const handleSubmit = async (data: HeroData) => {
    try {
      let bannerUrl = typeof data.image === "string" ? data.image : "";

      // Jika ada file gambar baru, upload dulu
      if (data.image instanceof File) {
        const uploadResult = await heroAPI.uploadBanner(data.image);
        bannerUrl = uploadResult.url;
      }

      // Update hero section
      const updatedHero = await heroAPI.updateHero({
        headline: data.headline,
        sub_headline: data.subHeadline,
        banner_image_url: bannerUrl,
      });

      // Update state dengan data terbaru
      const updatedData: HeroData = {
        image: updatedHero.banner_image_url || "/images/placeholder.png",
        headline: updatedHero.headline,
        subHeadline: updatedHero.sub_headline,
      };

      setHeroData(updatedData);
      setPreviewData(updatedData);

      alert("Hero section berhasil diupdate!");
    } catch (error) {
      console.error("Error updating hero:", error);
      alert("Gagal mengupdate hero section. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">Edit Hero Section</h2>

      <div className="row g-4">
        <div className="col-md-6">
          <HeroForm initialData={heroData} onSubmit={handleSubmit} />
        </div>

        <div className="col-md-6">
          <HeroPreview
            image={
              typeof previewData.image === "string"
                ? previewData.image
                : "/images/placeholder.png"
            }
            headline={previewData.headline}
            subHeadline={previewData.subHeadline}
          />
        </div>
      </div>
    </Container>
  );
}