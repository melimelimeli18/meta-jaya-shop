import React, { useState, useEffect } from "react";
import Modal from "./Modal";

interface Product {
  id?: number;
  name: string;
  price: string;
  variant: string;
  link: string;
  description: string;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: Product) => void; // <-- data dikirim sesuai API backend
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
    variant: "",
    link: "",
    description: "",
    category: "Stand",
  });

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        variant: initialData.variant || "",
        link: initialData.link || "",
        description: initialData.description || "",
        category: initialData.category || "Stand",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        variant: "",
        link: "",
        description: "",
        category: "Stand",
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

    // ⛔ Tidak ada image. Sesuai backend, kirim data biasa.
    const submitData: Product = {
      name: formData.name,
      price: formData.price,
      variant: formData.variant,
      link: formData.link,
      description: formData.description,
      category: formData.category,
    };

    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      price: "",
      variant: "",
      link: "",
      description: "",
      category: "Stand",
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
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">

          {/* === KOLOM KIRI === */}
          <div className="col-md-6">

            <div className="mb-3">
              <label className="form-label fw-semibold">Nama Produk</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nama Produk"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Harga Produk</label>
              <input
                type="text"
                name="price"
                className="form-control"
                placeholder="Harga Produk"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                name="variant"
                className="form-control"
                value={formData.variant}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              >
                <option value="">Pilih Category</option>
                <option value="Tweeter / Driver">Tweeter / Driver</option>
                <option value="Stand">Stand</option>
                <option value="Microphone">Microphone</option>
                <option value="Power Amplifier">Power Amplifier</option>
                <option value="Kit Power / Modul Speaker">Kit Power / Modul Speaker</option>
                <option value="Portable Speaker">Portable Speaker</option>
                <option value="Speaker Component / Komponen">Speaker Component / Komponen</option>
                <option value="Mixer Audio">Mixer Audio</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Link Produk</label>
              <input
                type="text"
                name="link"
                className="form-control"
                placeholder="Link Produk"
                value={formData.link}
                onChange={handleChange}
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
            </div>
          </div>

          {/* === KOLOM KANAN === */}
          <div className="col-md-6">
            <div className="mb-3" style={{ height: "100%" }}>
              <label className="form-label fw-semibold">Deskripsi Produk</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Deskripsi Produk"
                value={formData.description}
                onChange={handleChange}
                style={{
                  borderColor: "#468386",
                  borderRadius: "20px",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#468386",
              color: "white",
              borderRadius: "20px",
              padding: "8px 30px",
            }}
          >
            Terapkan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
