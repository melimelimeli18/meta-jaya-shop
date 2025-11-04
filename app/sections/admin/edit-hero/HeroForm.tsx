'use client';

import React, { useState } from 'react';
import ImageUpload from '@/app/components/admin/ImageUploadModal';

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
    typeof initialData?.image === 'string' ? initialData.image : ''
  );
  const [formData, setFormData] = useState({
    headline: initialData?.headline || '',
    subHeadline: initialData?.subHeadline || '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      image: image || preview,
      headline: formData.headline,
      subHeadline: formData.subHeadline,
    });
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
            placeholder="Nama Produk"
            value={formData.headline}
            onChange={handleChange}
            required
            style={{ borderColor: "#468386", borderRadius: "20px" }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Sub Headline</label>
          <input
            type="text"
            name="subHeadline"
            className="form-control"
            placeholder="Nama Produk"
            value={formData.subHeadline}
            onChange={handleChange}
            required
            style={{ borderColor: "#468386", borderRadius: "20px" }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: "#468386",
            color: "white",
            borderRadius: "20px",
            padding: "10px 30px",
          }}
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default HeroForm;