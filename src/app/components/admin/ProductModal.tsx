// src/app/components/admin/ProductModal.tsx

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  link: string;
  description: string;
  image?: string | null;
  file?: File | null;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: Product) => void;
  initialData?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  initialData,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Stand",
    link: "",
    description: "",
    file: null as File | null,
  });

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value: string): number => {
    const numberString = value.replace(/\./g, "");
    return parseInt(numberString, 10) || 0;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price:
          typeof initialData.price === "number"
            ? formatRupiah(initialData.price.toString())
            : initialData.price || "",
        category: initialData.category || "Stand",
        link: initialData.link || "",
        description: initialData.description || "",
        file: null,
      });

      if (initialData.image) {
        setPreview(initialData.image);
      }
    } else {
      setFormData({
        name: "",
        price: "",
        category: "Stand",
        link: "",
        description: "",
        file: null,
      });
      setPreview(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      setFormData({ ...formData, price: formatRupiah(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setFormData({ ...formData, file });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const priceNumber = parseRupiah(formData.price);

      let imageUrl = initialData?.image || null;

      // Upload image if file is selected
      if (formData.file) {
        const uploadApiUrl = process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API;

        if (!uploadApiUrl) {
          throw new Error("Upload API URL is not configured");
        }

        const formDataToSend = new FormData();
        formDataToSend.append("image", formData.file);

        console.log("Uploading image:", formData.file.name);

        const uploadResponse = await fetch(uploadApiUrl, {
          method: "POST",
          body: formDataToSend,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.data.publicUrl;
      }

      const submitData: Product = {
        ...(initialData?.id && { id: initialData.id }),
        name: formData.name.trim(),
        price: priceNumber,
        category: formData.category,
        link: formData.link.trim(),
        description: formData.description.trim(),
        image: imageUrl,
      };

      console.log("Submitting product data:", submitData);

      onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(
        error instanceof Error ? error.message : "Failed to submit product"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      price: "",
      category: "Stand",
      link: "",
      description: "",
      file: null,
    });
    setPreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{title}</h5>
        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
          }}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* === KIRI === */}
          <div className="col-md-6">
            {/* UPLOAD IMAGE */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Foto Produk <span className="text-danger">*</span>
              </label>

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
                style={{ borderColor: "#468386", borderRadius: "20px" }}
                required={!initialData?.image}
              />

              {formData.file && (
                <div className="mt-2">
                  <strong>File:</strong> {formData.file.name}
                </div>
              )}

              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="mt-2"
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "2px solid #ddd",
                  }}
                />
              )}
            </div>

            {/* NAME */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nama Produk <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Contoh: Speaker Aktif 12 Inch"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
            </div>

            {/* PRICE */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Harga Produk (Rp) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="price"
                className="form-control"
                placeholder="1.500.000"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
              <small className="text-muted">Format otomatis: 1.500.000</small>
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}>
                <option value="Tweeter / Driver">Tweeter / Driver</option>
                <option value="Stand">Stand</option>
                <option value="Microphone">Microphone</option>
                <option value="Power Amplifier">Power Amplifier</option>
                <option value="Kit Power / Modul Speaker">
                  Kit Power / Modul Speaker
                </option>
                <option value="Portable Speaker">Portable Speaker</option>
                <option value="Speaker Component / Komponen">
                  Speaker Component / Komponen
                </option>
                <option value="Mixer Audio">Mixer Audio</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Link Produk</label>
              <input
                type="url"
                name="link"
                className="form-control"
                placeholder="https://tokopedia.com/..."
                value={formData.link}
                onChange={handleChange}
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
            </div>
          </div>

          {/* === KANAN === */}
          <div className="col-md-6">
            <div className="mb-3" style={{ height: "calc(100% - 60px)" }}>
              <label className="form-label fw-semibold">Deskripsi Produk</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Deskripsi detail produk..."
                value={formData.description}
                onChange={handleChange}
                style={{
                  borderColor: "#468386",
                  borderRadius: "20px",
                  height: "100%",
                  minHeight: "200px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-end mt-3">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline-secondary me-2"
            style={{
              borderRadius: "20px",
              padding: "8px 30px",
            }}
            disabled={uploading}>
            Batal
          </button>

          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#468386",
              color: "white",
              borderRadius: "20px",
              padding: "8px 30px",
            }}
            disabled={uploading}>
            {uploading ? "Menyimpan..." : "Terapkan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
