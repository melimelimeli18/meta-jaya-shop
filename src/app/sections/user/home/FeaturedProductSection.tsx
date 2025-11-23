"use client";

import React from "react";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import {
  DriverSpeakerN850,
  ComponentRCFLF08HF150,
  TweeterSpeakerRCFN850,
} from "@/src/assets/images";
import OutlineButton from "@/src/app/components/shared/OutlineButton";

function FeaturedProductSection() {
  const products = [
    {
      id: 1,
      title: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
      image: DriverSpeakerN850,
      specs: [
        "Power Handling: 500W AES / 850W program",
        "Frequency Range: 500Hz - 20kHz",
        "Sensitivity: 109 dB",
        "Diaphragm: Pure Titanium, 3-inch",
      ],
    },
    {
      id: 2,
      title: "Speaker Component RCF LF08HF150",
      image: ComponentRCFLF08HF150,
      specs: [
        "Diameter: 8 inch",
        "Power Output: 100 Watt",
        "Frequency Range: 105Hz - 4.4kHz",
        "Sensitivity: 93 dB",
      ],
    },
    {
      id: 3,
      title: "Tweeter Speaker RCF N850",
      image: TweeterSpeakerRCFN850,
      specs: [
        "Power Max: 750 Watt",
        "Voice Coil (Spull): 3 inch",
        "Impedance: 8Ω",
        "Magnet: Besar, daya dorong kuat",
      ],
    },
  ];

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

        <div className="d-flex flex-wrap justify-content-center gap-4 gap-lg-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card d-flex flex-column justify-content-between">
              {/* Gambar Produk */}
              <div className="image-wrapper">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={380}
                  height={250}
                  className="product-image"
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

                {/* Nanti bakal diarahkan ke halaman masing-masing halaman, sesuai dengan ID yang ditembak dengan halaman */}
                <OutlineButton label="Lihat Detail" href="" />
              </div>
            </div>
          ))}
        </div>
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
