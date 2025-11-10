import React from "react";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  PinkThumbsUpIcon,
  PinkPriceTagIcon,
  PinkSettingIcon,
  PinkPeopleIcon,
} from "@/client/assets/icons";

function AboutSection() {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}>
      <Container className="text-center">
        {/* Judul */}
        <h2 className="fw-normal mb-5 about-title">
          Mengapa Pilih <span className="fw-bold">MetaJayaShop</span>
        </h2>

        {/* Grid 2x2 (desktop/tablet), 1x4 (mobile) */}
        <Row className="g-5 justify-content-center">
          {/* Item 1 */}
          <Col xs={12} sm={6} md={6} lg={6}>
            <div className="d-flex flex-column align-items-center">
              <div
                className="bg-light border-0 rounded-circle d-flex justify-content-center align-items-center mb-3"
                style={{
                  backgroundColor: "#FBD1D1",
                  width: "50px",
                  height: "50px",
                }}>
                <Image
                  src={PinkThumbsUpIcon}
                  alt="Thumbs Up"
                  width={50}
                  height={50}
                />
              </div>
              <h5 className="fw-bold text-black fs-5">Kualitas Teruji</h5>
              <p className="text-secondary mt-1">
                setiap produk sudah diuji performa dan daya tahan.
              </p>
            </div>
          </Col>
          {/* Item 2 */}
          <Col xs={12} sm={6} md={6} lg={6}>
            <div className="d-flex flex-column align-items-center">
              <div
                className="bg-light border-0 rounded-circle d-flex justify-content-center align-items-center mb-3"
                style={{
                  backgroundColor: "#FBD1D1",
                  width: "50px",
                  height: "50px",
                }}>
                <Image
                  src={PinkPriceTagIcon}
                  alt="Thumbs Up"
                  width={50}
                  height={50}
                />
              </div>
              <h5 className="fw-bold text-black fs-5">Harga Kompetitif</h5>
              <p className="text-secondary mt-1">
                harga langsung dari distributor tanpa markup berlebihan.
              </p>
            </div>
          </Col>
          {/* Item 3 */}
          <Col xs={12} sm={6} md={6} lg={6}>
            <div className="d-flex flex-column align-items-center">
              <div
                className="bg-light border-0 rounded-circle d-flex justify-content-center align-items-center mb-3"
                style={{
                  backgroundColor: "#FBD1D1",
                  width: "50px",
                  height: "50px",
                }}>
                <Image
                  src={PinkSettingIcon}
                  alt="Thumbs Up"
                  width={50}
                  height={50}
                />
              </div>
              <h5 className="fw-bold text-black fs-5">
                Garansi Resmi & Dukungan Teknis
              </h5>
              <p className="text-secondary mt-1">
                layanan purna jual jelas dan cepat.
              </p>
            </div>
          </Col>

          {/* Item 4 */}
          <Col xs={12} sm={6} md={6} lg={6}>
            <div className="d-flex flex-column align-items-center">
              <div
                className="bg-light border-0 rounded-circle d-flex justify-content-center align-items-center mb-3"
                style={{
                  backgroundColor: "#FBD1D1",
                  width: "50px",
                  height: "50px",
                }}>
                <Image
                  src={PinkPeopleIcon}
                  alt="Thumbs Up"
                  width={50}
                  height={50}
                />
              </div>
              <h5 className="fw-bold text-black fs-5">
                Tersedia untuk Semua Skala
              </h5>
              <p className="text-secondary mt-1">
                cocok untuk individu, komunitas, maupun event profesional.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Responsiveness */}
      <style>
        {`
          .about-title {
            font-size: 44px;
          }

          @media (max-width: 576px) {
            .about-title {
              font-size: 34px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AboutSection;
