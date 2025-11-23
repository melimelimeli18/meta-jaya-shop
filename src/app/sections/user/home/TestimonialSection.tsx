"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "react-bootstrap";
import { UserIcon, StarIcon } from "@/src/assets/icons";

function TestimonialSection() {
  const testimonials = [
    { username: "feliciacellwonk!jr", review: "Sesuai pesanan" },
    { username: "jufrisidrap533", review: "Terbaik 💯" },
    { username: "upmuu3to4l", review: "Suara jernih" },
    { username: "alfred.id", review: "Kualitas bagus banget" },
    { username: "sintashop99", review: "Mantap cepat sampai" },
  ];

  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <div style={{ backgroundColor: "#F3F3F3", padding: "60px 0" }}>
      {/* Header Section */}
      <Container className="text-center mb-5">
        <h2 className="fw-normal testimonial-title">
          Apa Kata <span className="fw-bold">Pelanggan</span> Kami
        </h2>
      </Container>

      {/* Infinite Scrolling Section */}
      <div className="w-100 overflow-hidden position-relative">
        <motion.div
          className="d-flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}>
          {loopedTestimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-4 shadow-sm p-4 mx-3 d-flex align-items-center"
              style={{
                minWidth: "300px",
                maxWidth: "300px",
                flex: "0 0 auto",
              }}>
              {/* Left: User Icon */}
              <div className="me-3 d-flex align-items-center">
                <Image src={UserIcon} alt="user" width={36} height={36} />
              </div>

              {/* Right: Column (Stars, Username, Review) */}
              <div className="d-flex flex-column align-items-start">
                <div className="d-flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src={StarIcon}
                      alt="star"
                      width={18}
                      height={18}
                    />
                  ))}
                </div>
                <p className="text-black mb-0" style={{ fontSize: "15px" }}>
                  {item.username}
                </p>
                <p className="fw-medium text-black mb-0">{item.review}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Responsive font size */}
      <style jsx>{`
        .testimonial-title {
          font-size: 44px;
          color: #000;
        }
        @media (max-width: 576px) {
          .testimonial-title {
            font-size: 34px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TestimonialSection;
