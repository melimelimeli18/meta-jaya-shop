import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import {
  SpeakerIllustration,
  PanggungIllustration,
  MusicIllustration,
  PortableSpeakerIllustration,
} from "@/src/assets/images";

function UsedProductSection() {
  return (
    <div
      style={{
        backgroundColor: "#Fff",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}>
      <Container className="text-center">
        {/* Judul */}
        <h1 className="fw-normal used-title mb-3">
          Cocok untuk Berbagai <span className="fw-bold">Kebutuhan</span>
        </h1>
        <p className="text-secondary fs-6 mb-5">
          Produk kami digunakan oleh banyak pengguna di berbagai skenario.
        </p>

        {/* Grid 4 item */}
        <Row className="g-5 justify-content-center">
          {/* 1 */}
          <Col xs={12} sm={6} md={6} lg={3}>
            <div className="d-flex flex-column align-items-center">
              <Image
                src={SpeakerIllustration}
                alt="Toko dan Rental Sound System"
                width={200}
                height={200}
                priority
              />
              <h5 className="fw-bold text-black fs-5 mt-3">
                Toko dan Rental Sound System
              </h5>
            </div>
          </Col>

          {/* 2 */}
          <Col xs={12} sm={6} md={6} lg={3}>
            <div className="d-flex flex-column align-items-center">
              <Image
                src={PanggungIllustration}
                alt="Event & Panggung Live"
                width={200}
                height={200}
                priority
              />
              <h5 className="fw-bold text-black fs-5 mt-3">
                Event & Panggung Live
              </h5>
            </div>
          </Col>

          {/* 3 */}
          <Col xs={12} sm={6} md={6} lg={3}>
            <div className="d-flex flex-column align-items-center">
              <Image
                src={MusicIllustration}
                alt="Studio Musik & Produksi Audio"
                width={200}
                height={200}
                priority
              />
              <h5 className="fw-bold text-black fs-5 mt-3">
                Studio Musik & Produksi Audio
              </h5>
            </div>
          </Col>

          {/* 4 */}
          <Col xs={12} sm={6} md={6} lg={3}>
            <div className="d-flex flex-column align-items-center">
              <Image
                src={PortableSpeakerIllustration}
                alt="Penggunaan Pribadi"
                width={200}
                height={200}
                priority
              />
              <h5 className="fw-bold text-black fs-5 mt-3">
                Penggunaan Pribadi
              </h5>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Responsiveness */}
      <style>
        {`
          .used-title {
            font-size: 44px;
          }

          @media (max-width: 576px) {
            .used-title {
              font-size: 34px !important;
            }
          }

          p {
            font-size: 18px !important;
            color: #717171 !important;
          }
        `}
      </style>
    </div>
  );
}

export default UsedProductSection;
