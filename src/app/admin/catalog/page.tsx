// src/app/admin/catalog/page.tsx
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
  sold?: number;
  image: string | null;
  description: string;
  link: string;
}

interface ProductModalData {
  name: string;
  price: number;
  category: string;
  link: string;
  description: string;
  image?: string | null;
}

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products dari API saat component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Fetch all products from API
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products...");

      const response = await fetch("http://localhost:5000/api/products");
      const result = await response.json();

      console.log("Fetch result:", result);

      if (result.success) {
        setProducts(result.data || []);
        console.log(`✅ ${result.data.length} products loaded`);
      } else {
        throw new Error(result.message || "Failed to fetch products");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat produk";
      console.error("Error fetching products:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter products by search term
   */
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Open modal for adding new product
   */
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing existing product
   */
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  /**
   * Open delete confirmation modal
   */
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handle create/update product submission
   */
  const handleSubmitProduct = async (data: ProductModalData) => {
    try {
      console.log("=== handleSubmitProduct START ===");
      console.log("Received data:", data);
      console.log("Current product:", currentProduct);

      // Prepare payload
      const payload = {
        name: data.name.trim(),
        price:
          typeof data.price === "number"
            ? data.price
            : parseFloat(String(data.price).replace(/[^0-9]/g, "") || "0"),
        category: data.category || "Stand",
        link: data.link.trim(),
        description: data.description?.trim() || "",
        image: data.image?.trim() || null,
      };

      console.log("Prepared payload:", payload);

      if (currentProduct) {
        // ===== UPDATE PRODUCT =====
        console.log("Updating product with id:", currentProduct.id);

        const response = await fetch(`/api/products/${currentProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("Update response status:", response.status);
        const result = await response.json();
        console.log("Update result:", result);

        if (!response.ok || !result.success) {
          if (result.errors && Array.isArray(result.errors)) {
            throw new Error(result.errors.join("\n"));
          }
          throw new Error(result.message || "Failed to update product");
        }

        // Update local state
        setProducts(
          products.map((p) => (p.id === currentProduct.id ? result.data : p))
        );

        alert("✅ Produk berhasil diupdate!");
        console.log("Product updated successfully:", result.data);
      } else {
        // ===== CREATE PRODUCT =====
        console.log("Creating new product...");

        const response = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("Create response status:", response.status);
        const result = await response.json();
        console.log("Create result:", result);

        if (!response.ok || !result.success) {
          if (result.errors && Array.isArray(result.errors)) {
            throw new Error(result.errors.join("\n"));
          }
          throw new Error(result.message || "Failed to create product");
        }

        // Add new product to local state
        setProducts([...products, result.data]);

        alert("✅ Produk berhasil ditambahkan!");
        console.log("Product created successfully:", result.data);
      }

      // Close modal and reset
      setIsModalOpen(false);
      setCurrentProduct(null);
      console.log("=== handleSubmitProduct END ===");
    } catch (error) {
      console.error("=== handleSubmitProduct ERROR ===");
      console.error("Error details:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      alert(`❌ Gagal menyimpan produk:\n${errorMessage}`);
    }
  };

  /**
   * Handle delete product confirmation
   */
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      console.log("Deleting product:", productToDelete.id);

      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log("Delete result:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete product");
      }

      // Remove from local state
      setProducts(products.filter((p) => p.id !== productToDelete.id));

      alert("✅ Produk berhasil dihapus!");
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      alert(`❌ Gagal menghapus produk:\n${errorMessage}`);
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  /**
   * Format price to Indonesian Rupiah
   */
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <Container fluid className="py-4">
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
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
      {/* Header Section */}
      <div className="row mb-4 align-items-center">
        {/* Search Box */}
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
              placeholder="Cari produk..."
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

        {/* Title */}
        <div className="col-md-4 text-center">
          <h2 className="fw-bold mb-0">Katalog MetaJayaShop</h2>
          <small className="text-muted">
            {products.length} produk tersedia
          </small>
        </div>

        {/* Add Button */}
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
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">
            {searchTerm
              ? `Tidak ada produk yang cocok dengan "${searchTerm}"`
              : "Belum ada produk. Klik tombol Tambah Produk untuk memulai."}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-4 position-relative">
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteClick(product)}
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
                  }}
                  title="Hapus produk">
                  ×
                </button>

                {/* Category Badge */}
                <div className="position-relative">
                  <span
                    className="position-absolute top-0 start-0 m-2 badge bg-light text-dark"
                    style={{ fontSize: "10px", zIndex: 5 }}>
                    {product.category}
                  </span>
                </div>

                {/* Product Image */}
                <img
                  src={product.image || "/images/placeholder.png"}
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

                {/* Product Info */}
                <div className="card-body text-center">
                  <h6
                    className="card-title fw-semibold mb-3"
                    title={product.name}>
                    {product.name.length > 50
                      ? `${product.name.substring(0, 50)}...`
                      : product.name}
                  </h6>

                  <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <span className="fw-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.sold !== undefined && (
                      <span className="text-muted" style={{ fontSize: "14px" }}>
                        {product.sold} Terjual
                      </span>
                    )}
                  </div>

                  {/* Edit Button */}
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
                    ✏️ Edit Produk
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProduct(null);
        }}
        title={currentProduct ? "Edit Produk" : "Tambah Produk"}
        onSubmit={handleSubmitProduct}
        initialData={currentProduct}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
    </Container>
  );
}
