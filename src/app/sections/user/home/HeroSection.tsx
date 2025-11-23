// sections/user/home/HeroSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Image from "next/image";
import { HeroBackground } from "@/src/assets/images";
import { heroAPI, HeroData } from "@/src/lib/api/hero";

function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await heroAPI.getHero();
        setHeroData(data);
      } catch (error) {
        console.error("Error fetching hero:", error);
        // Fallback ke data default jika error
        setHeroData({
          headline: "Peralatan Audio Berkualitas untuk Setiap Kebutuhan",
          sub_headline:
            "Kami menyediakan berbagai solusi audio profesional, dari speaker, mikrofon, hingga sistem suara untuk berbagai acara dan kebutuhan.",
          banner_image_url: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Gunakan banner dari backend jika ada, kalau tidak pakai default
  const backgroundImage = heroData?.banner_image_url || HeroBackground;
  const isExternalImage =
    typeof backgroundImage === "string" && backgroundImage.startsWith("http");

  return (
    <div
      className="position-relative d-flex align-items-center text-center text-dark"
      style={{
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
        overflow: "hidden",
      }}>
      {/* Background Image */}
      {isExternalImage ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <Image
          src={backgroundImage}
          alt="Hero Background"
          fill
          priority
          placeholder="blur"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            zIndex: -1,
          }}
        />
      )}

      {/* Content */}
      <Container>
        <h1 className="fw-bold hero-title text-white">
          {heroData?.headline ||
            "Peralatan Audio Berkualitas untuk Setiap Kebutuhan"}
        </h1>
        <p className="hero-subtitle mt-3 mx-auto text-white">
          {heroData?.sub_headline ||
            "Kami menyediakan berbagai solusi audio profesional, dari speaker, mikrofon, hingga sistem suara untuk berbagai acara dan kebutuhan."}
        </p>
      </Container>

      <style jsx>{`
        .hero-title {
          font-size: 34px; /* Mobile */
        }
        .hero-subtitle {
          font-size: 14px;
          max-width: 600px;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 44px;
          }
          .hero-subtitle {
            font-size: 18px;
          }
        }

        @media (min-width: 992px) {
          .hero-title {
            font-size: 50px;
          }
          .hero-subtitle {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroSection;
