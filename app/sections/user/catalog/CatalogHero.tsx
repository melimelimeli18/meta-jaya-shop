"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Image from "next/image";
import { HeroBackground } from "@/client/assets/images";

function CatalogHero() {
  return (
    <div
      className="position-relative d-flex align-items-center text-center text-dark"
      style={{
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
        overflow: "hidden",
      }}></div>
  );
}

export default CatalogHero;
