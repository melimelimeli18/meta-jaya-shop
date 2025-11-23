// File: app/product/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Container, Row, Col, Button } from "react-bootstrap";
import { HeartIcon } from "@/src/assets/icons";
import styles from "./ProductDetail.module.css";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  link: string;
  specifications?: {
    diameter?: string;
    powerOutput?: string;
    frequencyRange?: string;
    sensitivity?: string;
  };
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Product[];
}

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(process.env.NEXT_PUBLIC_PRODUCT_GET_API!);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          const foundProduct = result.data.find((p) => p.id === productId);

          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            throw new Error("Product not found");
          }
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBelanja = () => {
    if (product?.link) {
      window.open(product.link, "_blank");
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Memuat produk...</p>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Produk Tidak Ditemukan</h3>
          <p className="text-muted">
            {error || "Produk yang Anda cari tidak tersedia"}
          </p>
          <Button href="/katalog" variant="primary" className="mt-3">
            Kembali ke Katalog
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentRow}>
        {/* Image */}
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className={styles.productImage}
            unoptimized
            priority
          />
        </div>

        {/* Text Column */}
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>

          <div>
            <h2 className={styles.price}>{formatPrice(product.price)}</h2>
          </div>

          {/* SPEC */}
          {product.specifications && (
            <div className={styles.specifications}>
              {product.specifications.diameter && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Diameter:</span>
                  <span className={styles.specValue}>
                    {product.specifications.diameter}
                  </span>
                </div>
              )}
              {product.specifications.powerOutput && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Power Output:</span>
                  <span className={styles.specValue}>
                    {product.specifications.powerOutput}
                  </span>
                </div>
              )}
              {product.specifications.frequencyRange && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Frequency Range:</span>
                  <span className={styles.specValue}>
                    {product.specifications.frequencyRange}
                  </span>
                </div>
              )}
              {product.specifications.sensitivity && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Sensitivity:</span>
                  <span className={styles.specValue}>
                    {product.specifications.sensitivity}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          {product.description && (
            <div className={styles.description}>
              <p>{product.description}</p>
            </div>
          )}

          {/* CTA */}
          <div className={styles.actionButtons}>
            <button className={styles.belanjaButton} onClick={handleBelanja}>
              Belanja
            </button>

            <button
              className={`${styles.favoriteButton} ${
                isFavorite ? styles.active : ""
              }`}
              onClick={handleFavoriteToggle}>
              <Image src={HeartIcon} alt="Favorit" width={24} height={24} />
              Favorit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
