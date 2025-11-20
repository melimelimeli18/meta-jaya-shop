// src/app/components/admin/ProductModal.tsx

import React, { useState, useEffect } from "react";
import Modal from "./Modal";

interface Product {
  id?: string; // Changed from number to string (database uses text)
  name: string;
  price: number; // Changed from string to number (API expects number)
  category: string; // Changed from variant to category (database field)
  link: string;
  description: string;
  image?: string | null; // Added image field (database field)
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
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Stand",
    link: "",
    description: "",
    image: "",
  });

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value: string): number => {
    // Remove dots and convert to number
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
        image: initialData.image || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "Stand",
        link: "",
        description: "",
        image: "",
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert price from formatted string to number
    const priceNumber = parseRupiah(formData.price);

    // Prepare data according to API requirements
    const submitData: Product = {
      name: formData.name.trim(),
      price: priceNumber, // Send as number
      category: formData.category,
      link: formData.link.trim(),
      description: formData.description.trim() || "", // Ensure not undefined
      image: formData.image.trim() || null, // Send null if empty
    };

    console.log("Submitting product data:", submitData);

    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      price: "",
      category: "Stand",
      link: "",
      description: "",
      image: "",
    });
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
          {/* === KOLOM KIRI === */}
          <div className="col-md-6">
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

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Harga Produk (Rp) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="price"
                className="form-control"
                placeholder="Contoh: 1.500.000"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
              <small className="text-muted">Format otomatis: 1.500.000</small>
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Category <span className="text-danger">*</span>
              </label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}>
                <option value="">Pilih Category</option>
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
              <label className="form-label fw-semibold">
                Link Produk <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                name="link"
                className="form-control"
                placeholder="https://tokopedia.com/..."
                value={formData.link}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
              <small className="text-muted">URL lengkap dengan https://</small>
            </div>
          </div>

          {/* === KOLOM KANAN === */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">URL Gambar</label>
              <input
                type="url"
                name="image"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
              <small className="text-muted">Opsional - URL gambar produk</small>
            </div>

            <div className="mb-3" style={{ height: "calc(100% - 100px)" }}>
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
              <small className="text-muted">
                Opsional - Detail spesifikasi produk
              </small>
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
            }}>
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
            }}>
            Terapkan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
