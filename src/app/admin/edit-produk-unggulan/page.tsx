// src/app/admin/edit-produk-unggulan/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import FeaturedProductList from "@/src/app/sections/admin/edit-produk-unggulan/FeaturedProductList";

interface Product {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  category?: string;
  image?: string;
  description?: string;
  link?: string;
}

const MAX_FEATURED = 3;

export default function EditProdukUnggulanPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      let productsData = [];
      if (Array.isArray(result)) {
        productsData = result;
      } else if (result.data && Array.isArray(result.data)) {
        productsData = result.data;
      } else if (result.success && result.data) {
        productsData = result.data;
      }

      const formattedProducts = productsData.map((product: any) => ({
        id: product.id,
        name: product.name,
        price:
          typeof product.price === "number"
            ? `Rp${product.price.toLocaleString("id-ID")}`
            : product.price,
        isFeatured: product.is_featured || product.isFeatured || false,
        category: product.category,
        image: product.image,
        description: product.description,
        link: product.link,
      }));

      setProducts(formattedProducts);

      const currentFeatured = new Set(
        formattedProducts
          .filter((p: Product) => p.isFeatured)
          .map((p: Product) => p.id)
      );
      setSelectedProducts(currentFeatured);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Terjadi kesalahan saat mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelection = (id: string) => {
    setSelectedProducts((prev) => {
      const newSelected = new Set(prev);

      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        if (newSelected.size >= MAX_FEATURED) {
          alert(
            `Maksimal hanya ${MAX_FEATURED} produk yang bisa dijadikan unggulan!`
          );
          return prev;
        }
        newSelected.add(id);
      }

      return newSelected;
    });
  };

  const handleSaveFeaturedProducts = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const productsToUpdate = products.map((product) => ({
        id: product.id,
        shouldBeFeatured: selectedProducts.has(product.id),
      }));

      const response = await fetch("/api/products/featured/batch", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: productsToUpdate,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan produk unggulan");
      }

      setProducts(
        products.map((p) => ({
          ...p,
          isFeatured: selectedProducts.has(p.id),
        }))
      );

      setSuccessMessage("✅ Produk unggulan berhasil disimpan!");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving featured products:", err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan"
      );
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    const currentFeatured = new Set(
      products.filter((p) => p.isFeatured).map((p) => p.id)
    );

    if (currentFeatured.size !== selectedProducts.size) return true;

    for (const id of selectedProducts) {
      if (!currentFeatured.has(id)) return true;
    }

    return false;
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Memuat data produk...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error && products.length === 0) {
    return (
      <Container fluid className="py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={fetchProducts}>
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="fw-bold mb-4 text-center">Produk Unggulan</h2>

          {successMessage && (
            <div className="alert alert-success text-center mb-3" role="alert">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center mb-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="d-flex gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleSaveFeaturedProducts}
              disabled={saving || !hasChanges()}
              style={{ minWidth: "200px" }}>
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"></span>
                  Menyimpan...
                </>
              ) : (
                "Simpan Produk Unggulan"
              )}
            </button>
          </div>

          <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
            <span>
              <strong>Produk Terpilih:</strong> {selectedProducts.size} /{" "}
              {MAX_FEATURED}
            </span>
            {hasChanges() && (
              <span className="badge bg-warning text-dark">
                Ada perubahan yang belum disimpan
              </span>
            )}
          </div>

          <FeaturedProductList
            products={filteredProducts.map((p) => ({
              ...p,
              isFeatured: selectedProducts.has(p.id),
            }))}
            onToggleFeatured={handleToggleSelection}
          />

          <div className="bg-light rounded-3 p-3 mt-4 text-center">
            <small className="text-muted">
              <strong>💡 Tips:</strong> Maksimal {MAX_FEATURED} produk yang bisa
              dijadikan unggulan. Centang checkbox untuk memilih produk, lalu
              klik tombol <strong>&quot;Simpan Produk Unggulan&quot;</strong>{" "}
              untuk menyimpan perubahan. Produk yang disimpan akan muncul di
              section &quot;Produk Unggulan&quot; pada halaman user.
            </small>
          </div>

          {selectedProducts.size >= MAX_FEATURED && (
            <div className="alert alert-warning text-center mt-3" role="alert">
              ⚠️ Sudah mencapai batas maksimal {MAX_FEATURED} produk unggulan.
              Hapus centang salah satu produk untuk menambah yang lain.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
