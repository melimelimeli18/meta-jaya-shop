// src/app/sections/user/home/FeaturedProductSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import OutlineButton from "@/src/app/components/shared/OutlineButton";

interface FeaturedProduct {
  id: string;
  title: string;
  image: string;
  specs: string[];
  price: string;
  link: string;
}

function FeaturedProductSection() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/products");

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

      const featuredProducts = productsData
        .filter((product: any) => product.is_featured || product.isFeatured)
        .slice(0, 3)
        .map((product: any) => {
          // Truncate description to max 150 characters
          let truncatedDescription = product.description || "";
          if (truncatedDescription.length > 150) {
            truncatedDescription =
              truncatedDescription.substring(0, 150) + "...";
          }

          return {
            id: product.id,
            title: product.name,
            image: product.image || "/placeholder-product.jpg",
            specs: truncatedDescription
              ? truncatedDescription
                  .split("\n")
                  .filter((spec: string) => spec.trim() !== "")
              : [],
            price:
              typeof product.price === "number"
                ? `Rp${product.price.toLocaleString("id-ID")}`
                : product.price,
            link: product.link || `/products/${product.id}`,
          };
        });

      setProducts(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#F3F3F3",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}>
      <Container className="text-center">
        <h2 className="fw-semibold mb-5">
          Produk <span style={{ color: "#000" }}>Unggulan</span>
        </h2>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-4 gap-lg-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card d-flex flex-column justify-content-between">
                {/* Gambar Produk - Using img tag instead of Next Image */}
                <div className="image-wrapper">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>

                {/* Konten Produk */}
                <div className="product-content d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <h5 className="product-title">{product.title}</h5>
                    <div className="product-desc">
                      {product.specs.map((spec, index) => (
                        <p key={index} className="mb-1">
                          {spec}
                        </p>
                      ))}
                    </div>
                  </div>

                  <OutlineButton label="Lihat Detail" href={product.link} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      <style jsx>{`
        .product-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 16px;
          width: 380px;
          height: 572px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }

        .image-wrapper {
          width: 100%;
          max-height: 209px;
          overflow: hidden;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }

        .product-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .product-title {
          font-size: 20px;
          color: #000;
          text-align: center;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .product-desc p {
          font-size: 16px;
          color: #000;
          margin-bottom: 4px;
          text-align: left;
        }

        .detail-btn {
          border: 1px solid #468386;
          background: transparent;
          color: #468386;
          font-size: 16px;
          font-weight: 500;
          padding: 12px 24px;
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .detail-btn:hover {
          background: #468386;
          color: #fff;
        }

        @media (max-width: 992px) {
          .product-card {
            width: 380px;
          }
        }

        @media (max-width: 768px) {
          .product-card {
            width: 336px;
          }
          .product-title {
            font-weight: 600;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default FeaturedProductSection;
