"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Image from "next/image";
import { HeroBackground } from "@/client/assets/images";

function HeroSection() {
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
      <Image
        src={HeroBackground}
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

      {/* Content */}
      <Container>
        <h1 className="fw-bold hero-title text-white">
          Peralatan Audio Berkualitas untuk Setiap Kebutuhan
        </h1>
        <p className="hero-subtitle mt-3 mx-auto text-white">
          Kami menyediakan berbagai solusi audio profesional, dari speaker,
          mikrofon, hingga sistem suara untuk berbagai acara dan kebutuhan.
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
