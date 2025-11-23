"use client";

import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import { DriverSpeakerN850 } from "@/src/assets/images";
import { Container, Row, Col } from "react-bootstrap";
import { OutlineButton } from "@/src/app/components/shared";
import SearchBar from "@/src/app/components/shared/Searchbar";
import CategoryFilter, { FilterOption } from "./CategoryFilter";
import styles from "./ProductGrid.module.css";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  link: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Product[];
}

const ProductGridSection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(process.env.NEXT_PUBLIC_PRODUCT_GET_API!);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();
    return uniqueCategories;
  }, [products]);

  // Count products per category
  const getProductCount = (category: string) => {
    if (category === "Semua") return products.length;
    return products.filter((p) => p.category === category).length;
  };

  // Prepare filter options
  const filterOptions: FilterOption[] = useMemo(() => {
    return [
      { label: "Semua", value: "Semua", count: products.length },
      ...categories.map((cat) => ({
        label: cat,
        value: cat,
        count: getProductCount(cat),
      })),
    ];
  }, [categories, products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedFilter === "Semua" || selectedFilter === product.category;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedFilter, products]);

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSelectedFilter("Semua");
  };

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Container fluid className="py-4 px-3 px-md-5">
        <div className={styles.emptyState}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className={styles.emptyText}>Memuat produk...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4 px-3 px-md-5">
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h5 className={styles.emptyTitle}>Gagal memuat produk</h5>
          <p className={styles.emptyText}>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}>
            Coba Lagi
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-3 px-md-5">
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Cari barang"
        onFilterClick={() => setShowFilter(true)}
      />

      <Row>
        {/* Sidebar Filter (Desktop) */}
        <Col md={2}>
          <CategoryFilter
            title="Filter Kategori"
            options={filterOptions}
            selectedValue={selectedFilter}
            onChange={handleFilterChange}
            showMobile={showFilter}
            onMobileClose={() => setShowFilter(false)}
            variant="radio"
            onApply={handleApplyFilter}
          />
        </Col>

        {/* Product List */}
        <Col md={9} className="text-start">
          <div className={styles.productHeader}>
            <div>
              <h3 className={styles.productTitle}>Katalog MetaJayaShop</h3>
              <p className={styles.productSubtitle}>
                {selectedFilter !== "Semua" && `Kategori: ${selectedFilter} • `}
                {filteredProducts.length} produk ditemukan
              </p>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCardWrapper}>
                  <div className={styles.productCard}>
                    <div className={styles.productImageWrapper}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={277}
                        height={180}
                        className={styles.productImage}
                        unoptimized
                      />
                    </div>

                    <div className={styles.productBody}>
                      <div>
                        <span className={styles.productBadge}>
                          {product.category}
                        </span>
                        <h5 className={styles.productCardTitle}>
                          {product.name}
                        </h5>
                        <p className={styles.productPrice}>
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <OutlineButton
                        label="Lihat Detail"
                        href={`/product/${product.id}`}
                        className="w-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h5 className={styles.emptyTitle}>
                Tidak ada produk yang sesuai dengan pencarian Anda
              </h5>
              <p className={styles.emptyText}>
                Coba gunakan kata kunci lain atau ubah filter kategori
              </p>
              <button className="btn btn-primary" onClick={handleResetSearch}>
                Reset Pencarian
              </button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductGridSection;
