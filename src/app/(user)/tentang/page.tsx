"use client";
import React from "react";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { FilledButton } from "@/src/app/components/shared";
import { LogoRoundShadow154 } from "@/src/assets/logo";

export default function Tentang() {
  return (
    <>
      <Container
        fluid
        className="d-flex flex-column align-items-center justify-content-center py-5">
        {/* Logo */}
        <div className="mb-5">
          <Image
            src={LogoRoundShadow154}
            alt="MetaJayaShop Logo"
            width={163}
            height={154}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Tentang MetaJayaShop */}
        <section
          className="px-3 px-md-5"
          style={{
            maxWidth: "900px",
            textAlign: "left",
          }}>
          <h1
            className="fw-normal mb-4 about-title text-center text-md-center"
            style={{
              lineHeight: "1.2",
            }}>
            Tentang <strong>MetaJayaShop</strong>
          </h1>

          <p
            className="about-desc"
            style={{
              color: "#717171",
              lineHeight: "1.8",
            }}>
            MetaJayaShop adalah penyedia perlengkapan audio yang berfokus pada
            kualitas, ketahanan, dan kinerja nyata di lapangan. Kami melayani
            kebutuhan berbagai kalangan, mulai dari pengguna rumahan, bengkel
            elektronik, penyedia jasa sound system, hingga pelaku acara
            profesional.
            <br />
            <br />
            Kami menyediakan beragam produk seperti microphone, power amplifier,
            modul speaker, tweeter, portable speaker, mixer audio, dan aksesoris
            pendukung lainnya. Setiap produk dipilih dengan standar performa dan
            keandalan yang tinggi, agar pelanggan mendapatkan hasil suara
            terbaik di setiap penggunaan.
            <br />
            <br />
            MetaJayaShop berdiri untuk mempermudah siapa pun dalam mendapatkan
            perlengkapan audio tanpa harus menebak-nebak kualitas. Kami memahami
            pentingnya suara yang jernih, daya yang stabil, dan komponen yang
            tahan lama, itulah dasar dari setiap produk yang kami sediakan. Kami
            juga hadir di berbagai platform e-commerce untuk memudahkan
            pembelian dan pengiriman ke seluruh Indonesia.
          </p>
        </section>

        {/* Temukan Kami */}
        <section className="text-center mt-5">
          <h2
            className="find-title mb-4 fw-normal"
            style={{
              lineHeight: "1.2",
            }}>
            Temukan kami di
          </h2>

          <FilledButton
            label="Cek Toko Shopee"
            type="button"
            onClick={() =>
              window.open(
                "https://id.shp.ee/uecCNYK",
                "_blank",
                "noopener noreferrer"
              )
            }
          />
        </section>

        {/* Lokasi Toko */}
        <section
          className="text-center mt-5 px-3 px-md-5"
          style={{ maxWidth: "900px" }}>
          <h2
            className="location-title mb-4 fw-normal"
            style={{
              lineHeight: "1.2",
            }}>
            Lokasi Toko Kami
          </h2>

          <div
            className="ratio ratio-16x9 mx-auto"
            style={{
              maxWidth: "800px",
              borderRadius: "12px",
              overflow: "hidden",
            }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.4530640747666!2d106.81347386347656!3d-6.143310199999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f76e370c86f9%3A0xc7d2c4d0f9296deb!2sTM%20Harco%20Glodok!5e0!3m2!1sen!2sid!4v1762673996358!5m2!1sen!2sid"
              width="1000"
              height="1000"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </section>
      </Container>

      {/* Responsive Typography */}
      <style jsx>{`
        .about-title {
          font-size: 50px;
          margin-bottom: 40px;
        }
        .about-desc {
          font-size: 18px;
        }
        .find-title,
        .location-title {
          font-size: 44px;
        }

        @media (max-width: 768px) {
          .about-title {
            font-size: 41px;
          }
          .about-desc {
            font-size: 16px;
          }
          .find-title,
          .location-title {
            font-size: 41px;
          }
        }
      `}</style>
    </>
  );
}
