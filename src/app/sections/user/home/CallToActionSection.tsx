"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import FilledButton from "@/src/app/components/shared/FilledButton";

function CallToActionSection() {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <Container className="text-center d-flex flex-column align-items-center">
        {/* Judul */}
        <h2 className="fw-normal cta-title mb-3">
          Butuh Bantuan Pilih Peralatan Audio?
        </h2>

        {/* Deskripsi */}
        <p className="cta-subtext mb-4">
          Tim MetaJaya siap membantu Anda menemukan produk audio yang sesuai
          kebutuhan.
        </p>

        {/* Tombol CTA */}
        <FilledButton
          label="Lihat Katalog"
          href="/katalog"
          className="fw-semibold text-white text-decoration-none rounded-pill"
        />
      </Container>

      {/* Responsiveness */}
      <style jsx>{`
        .cta-title {
          color: #000;
          font-size: 44px;
        }

        .cta-subtext {
          color: #717171;
          font-size: 18px;
          max-width: 600px;
        }

        @media (max-width: 576px) {
          .cta-title {
            font-size: 34px;
          }
        }
      `}</style>
    </div>
  );
}

export default CallToActionSection;
