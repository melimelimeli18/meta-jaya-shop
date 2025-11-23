// src/app/components/user/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FavoriteModal from "./FavoriteModal";

function UserNavbar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    // Update badge count
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("metajaya_favorites");
        if (stored) {
          const favorites = JSON.parse(stored);
          setFavoriteCount(favorites.length);
        } else {
          setFavoriteCount(0);
        }
      } catch (error) {
        console.error("Error reading favorites:", error);
      }
    };

    updateCount();

    // Listen to storage changes
    window.addEventListener("storage", updateCount);
    // Custom event untuk update dari same tab
    window.addEventListener("favoritesUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("favoritesUpdated", updateCount);
    };
  }, []);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Update count after closing modal
    try {
      const stored = localStorage.getItem("metajaya_favorites");
      if (stored) {
        const favorites = JSON.parse(stored);
        setFavoriteCount(favorites.length);
      } else {
        setFavoriteCount(0);
      }
    } catch (error) {
      console.error("Error reading favorites:", error);
    }
  };

  return (
    <>
      <Navbar expand="lg" bg="white" variant="light" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand as={Link} href="/">
            <Image
              src="/images/MetaJaya.png"
              alt="MetaJaya Logo"
              width={80}
              height={80}
              className="d-inline-block align-top"
              style={{ objectFit: "contain" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                href="/"
                className={`mx-3 ${pathname === "/" ? "fw-bold" : "fw-normal"}`}
                style={{ color: "#333" }}>
                Beranda
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/tentang"
                className={`mx-3 ${
                  pathname === "/tentang" ? "fw-bold" : "fw-normal"
                }`}
                style={{ color: "#333" }}>
                Tentang
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/katalog"
                className={`mx-3 ${
                  pathname === "/katalog" ? "fw-bold" : "fw-normal"
                }`}
                style={{ color: "#333" }}>
                Katalog
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/privacy-policy"
                className={`mx-3 ${
                  pathname === "/privacy-policy" ? "fw-bold" : "fw-normal"
                }`}
                style={{ color: "#333" }}>
                Privacy Policy
              </Nav.Link>
            </Nav>
            <Nav>
              {/* Favorite button */}
              <Nav.Link
                href="#"
                onClick={handleOpenModal}
                className="ms-3 position-relative">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "#333" }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {favoriteCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                    }}>
                    {favoriteCount}
                  </span>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <FavoriteModal isOpen={showModal} onClose={handleCloseModal} />
    </>
  );
}

export default UserNavbar;
