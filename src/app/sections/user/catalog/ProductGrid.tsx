"use client";

import React, { useState, useMemo } from "react";
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
  title: string;
  price: string;
  category: string;
  image: any;
}

const ProductGridSection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua");

  // Product data
  const products: Product[] = [
    {
      id: "PRD001",
      title: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
      price: "Rp350.000",
      category: "Speaker Component",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD002",
      title: "Stand Microphone Premium Quality",
      price: "Rp150.000",
      category: "Stand",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD003",
      title: "Power Amplifier 1000W Professional",
      price: "Rp2.500.000",
      category: "Power Amplifier",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD004",
      title: "Wireless Microphone System",
      price: "Rp850.000",
      category: "Microphone",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD005",
      title: "Portable Bluetooth Speaker",
      price: "Rp450.000",
      category: "Portable Speaker",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD006",
      title: "Audio Mixer 8 Channel",
      price: "Rp1.200.000",
      category: "Mixer Audio",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD007",
      title: "Kit Power Modul Speaker 400W",
      price: "Rp320.000",
      category: "Kit Power/ Modul Speaker",
      image: DriverSpeakerN850,
    },
    {
      id: "PRD008",
      title: "Dynamic Vocal Microphone",
      price: "Rp280.000",
      category: "Microphone",
      image: DriverSpeakerN850,
    },
  ];

  const categories = [
    "Stand",
    "Microphone",
    "Power Amplifier",
    "Kit Power/ Modul Speaker",
    "Portable Speaker",
    "Speaker Component",
    "Mixer Audio",
  ];

  // Count products per category
  const getProductCount = (category: string) => {
    if (category === "Semua") return products.length;
    return products.filter((p) => p.category === category).length;
  };

  // Prepare filter options
  const filterOptions: FilterOption[] = [
    { label: "Semua", value: "Semua", count: products.length },
    ...categories.map((cat) => ({
      label: cat,
      value: cat,
      count: getProductCount(cat),
    })),
  ];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                        alt={product.title}
                        width={277}
                        height={180}
                        className={styles.productImage}
                        priority={product.id === "PRD001"}
                      />
                    </div>

                    <div className={styles.productBody}>
                      <div>
                        <span className={styles.productBadge}>
                          {product.category}
                        </span>
                        <h5 className={styles.productCardTitle}>
                          {product.title}
                        </h5>
                        <p className={styles.productPrice}>{product.price}</p>
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
