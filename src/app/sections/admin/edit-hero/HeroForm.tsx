// sections/admin/edit-hero/HeroForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import ImageUpload from "@/src/app/components/admin/ImageUploadModal";

interface HeroData {
  image: string | File;
  headline: string;
  subHeadline: string;
}

interface HeroFormProps {
  initialData?: HeroData;
  onSubmit: (data: HeroData) => void;
}

const HeroForm: React.FC<HeroFormProps> = ({ initialData, onSubmit }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    typeof initialData?.image === "string" ? initialData.image : ""
  );
  const [formData, setFormData] = useState({
    headline: initialData?.headline || "",
    subHeadline: initialData?.subHeadline || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form saat initialData berubah
  useEffect(() => {
    if (initialData) {
      setFormData({
        headline: initialData.headline || "",
        subHeadline: initialData.subHeadline || "",
      });
      if (typeof initialData.image === "string") {
        setPreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleImageSelect = (file: File | null) => {
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        image: image || preview,
        headline: formData.headline,
        subHeadline: formData.subHeadline,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label fw-semibold">Foto Banner</label>
          <ImageUpload onImageSelect={handleImageSelect} preview={preview} />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Headline</label>
          <input
            type="text"
            name="headline"
            className="form-control"
            placeholder="Headline Hero"
            value={formData.headline}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            style={{ borderColor: "#468386", borderRadius: "20px" }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Sub Headline</label>
          <input
            type="text"
            name="subHeadline"
            className="form-control"
            placeholder="Sub Headline Hero"
            value={formData.subHeadline}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            style={{ borderColor: "#468386", borderRadius: "20px" }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={isSubmitting}
          style={{
            backgroundColor: "#468386",
            color: "white",
            borderRadius: "20px",
            padding: "10px 30px",
          }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </form>
    </div>
  );
};

export default HeroForm;