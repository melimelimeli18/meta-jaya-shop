import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import ImageUpload from "./ImageUploadModal";

interface Product {
  id?: number;
  name: string;
  price: string;
  variant: string;
  link: string;
  description: string;
  category: string;
  image?: string | File;
  stock?: string;
  sold?: string;
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
  initialData 
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    variant: "",
    link: "",
    description: "",
    category: "Stand",
  });

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
      if (initialData.image && typeof initialData.image === 'string') {
        setPreview(initialData.image);
      }
    } else {
      setFormData({
        name: "",
        price: "",
        variant: "",
        link: "",
        description: "",
        category: "Stand",
      });
      setPreview("");
    }
  }, [initialData, isOpen]);

  const handleImageSelect = (file: File | null) => {
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: Product = {
      ...formData,
      image: image || preview
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
    setImage(null);
    setPreview("");
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
            color: "#666"
          }}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Foto Produk</label>
              <ImageUpload onImageSelect={handleImageSelect} preview={preview} />
            </div>

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

            <div className="mb-3">
              <label className="form-label fw-semibold">Variasi Produk</label>
              <input
                type="text"
                name="variant"
                className="form-control"
                placeholder="Contoh: Merah, Biru, Hitam"
                value={formData.variant}
                onChange={handleChange}
                required
                style={{ borderColor: "#468386", borderRadius: "20px" }}
              />
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

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Deskripsi Produk</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Deskripsi Produk"
                value={formData.description}
                onChange={handleChange}
                rows={10}
                style={{ borderColor: "#468386", borderRadius: "20px" }}
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
              padding: "8px 30px" 
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