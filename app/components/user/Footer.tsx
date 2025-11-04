'use client';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
import Link from 'next/link';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', borderTop: '3px solid #f8f9fa', paddingTop: '40px', paddingBottom: '20px' }}>
      <Container>
        <Row className="align-items-start">
          {/* Logo dan Tagline - Kiri */}
          <Col md={6} className="mb-4">
            <Image
              src="/images/MetaJaya.png"
              alt="MetaJaya Logo"
              width={120}
              height={120}
              style={{ objectFit: 'contain' }}
            />
            <h5 className="fw-bold mt-3" style={{ color: '#333' }}>
              Solusi Peralatan Audio yang Teruji
            </h5>
            <p className="text-muted mt-3" style={{ fontSize: '14px' }}>
              Gedung Harco Glodok, Jalan Hayam Wuruk, Glodok, Taman Sari (LT 6 A-OF 57)
            </p>
          </Col>

          {/* Link Cepat & Link Toko - Kanan */}
          <Col md={6} className="mb-4">
            <Row>
              <Col xs={6}>
                <h6 className="fw-bold mb-3" style={{ color: '#333' }}>Link Cepat</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>
                      Beranda
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/about-us" style={{ color: '#666', textDecoration: 'none' }}>
                      About
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/catalog" style={{ color: '#666', textDecoration: 'none' }}>
                      Catalog
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/privacy-policy" style={{ color: '#666', textDecoration: 'none' }}>
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </Col>

              <Col xs={6}>
                <h6 className="fw-bold mb-3" style={{ color: '#333' }}>Link Toko</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a 
                      href="https://id.shp.ee/uecCNYK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#666', textDecoration: 'none' }}
                    >
                      Shopee
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4 pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
          <Col className="text-center">
            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
              &copy; {new Date().getFullYear()} MetaJaya Shop. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;