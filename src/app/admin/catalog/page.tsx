"use client";

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import ProductModal from "@/src/app/components/admin/ProductModal";
import DeleteModal from "@/src/app/components/admin/DeleteModal";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock?: string;
  variant?: string;
  sold: number;
  image: string;
  description: string;
  link: string;
}

interface ProductModalData {
  name: string;
  price: string;
  variant?: string;
  link: string;
  description: string;
  category: string;
  image?: string | File;
}

const API_URL = "http://localhost:5000/products";

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch products dari API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      } else {
        setError("Gagal memuat produk");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat produk");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      // TODO: Implementasi DELETE ke API
      setProducts(products.filter((p) => p.id !== productToDelete));
      setProductToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleSubmitProduct = (data: ProductModalData) => {
    if (currentProduct) {
      // TODO: Implementasi UPDATE ke API
      setProducts(
        products.map((p) =>
          p.id === currentProduct.id
            ? {
                ...p,
                name: data.name,
                price: parseFloat(data.price.replace(/[^0-9]/g, "") || "0"),
                variant: data.variant || "",
                link: data.link,
                description: data.description,
                category: data.category,
                image:
                  typeof data.image === "string"
                    ? data.image
                    : data.image
                    ? URL.createObjectURL(data.image)
                    : p.image,
              }
            : p
        )
      );
    } else {
      // TODO: Implementasi CREATE ke API
      const newProduct: Product = {
        id: `${Date.now()}`,
        name: data.name,
        category: data.category || "Stand",
        price: parseFloat(data.price.replace(/[^0-9]/g, "") || "0"),
        sold: 0,
        variant: data.variant,
        image: data.image
          ? typeof data.image === "string"
            ? data.image
            : URL.createObjectURL(data.image)
          : "/images/placeholder.png",
        description: data.description,
        link: data.link,
      };
      setProducts([...products, newProduct]);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Memuat produk...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchProducts}>
            Coba Lagi
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-4">
          <div className="position-relative">
            <span
              className="position-absolute"
              style={{
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}>
              🔍
            </span>
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Cari barang"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "25px",
                borderColor: "#468386",
                padding: "10px 15px 10px 40px",
              }}
            />
          </div>
        </div>

        <div className="col-md-4 text-center">
          <h2 className="fw-bold mb-0">Katalog MetaJayaShop</h2>
        </div>

        <div className="col-md-4 text-end">
          <button
            className="btn"
            style={{
              backgroundColor: "#468386",
              color: "white",
              borderRadius: "20px",
              padding: "10px 30px",
            }}
            onClick={handleAddProduct}>
            Tambah Produk
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Tidak ada produk ditemukan</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 position-relative">
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="position-absolute top-0 end-0 m-2 btn btn-sm btn-danger rounded-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    padding: 0,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                  }}>
                  ×
                </button>

                <div className="position-relative">
                  <span
                    className="position-absolute top-0 start-0 m-2 badge bg-light text-dark"
                    style={{ fontSize: "10px" }}>
                    {product.category}
                  </span>
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "1rem",
                    borderTopRightRadius: "1rem",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.png";
                  }}
                />

                <div className="card-body text-center">
                  <h6 className="card-title fw-semibold mb-3">
                    {product.name}
                  </h6>

                  <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <span className="fw-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-muted" style={{ fontSize: "14px" }}>
                      {product.sold} Terjual
                    </span>
                  </div>

                  <button
                    className="btn w-100"
                    style={{
                      backgroundColor: "white",
                      color: "#468386",
                      border: "2px solid #468386",
                      borderRadius: "20px",
                      padding: "8px",
                    }}
                    onClick={() => handleEditProduct(product)}>
                    Edit Produk
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? "Edit Produk" : "Tambah Produk"}
        onSubmit={handleSubmitProduct}
        initialData={currentProduct}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
