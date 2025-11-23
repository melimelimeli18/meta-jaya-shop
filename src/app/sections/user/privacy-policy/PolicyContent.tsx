// File: src/app/sections/user/privacy-policy/PolicyContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

interface PrivacyPolicy {
  id: number;
  content: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: PrivacyPolicy;
}

function PolicyContent() {
  const [privacyContent, setPrivacyContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_PRIVACY_POLICY_API || "/api/privacy-policy";

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setPrivacyContent(result.data.content);
        setUpdatedAt(result.data.updated_at);
      } else {
        setError("Kebijakan privasi tidak tersedia saat ini.");
      }
    } catch (err) {
      console.error("Error fetching privacy policy:", err);
      setError("Gagal memuat kebijakan privasi. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          minHeight: "100vh",
          paddingTop: "60px",
          paddingBottom: "60px",
        }}>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3" style={{ fontSize: "16px", color: "#666" }}>
              Memuat kebijakan privasi...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          minHeight: "100vh",
          paddingTop: "60px",
          paddingBottom: "60px",
        }}>
        <Container>
          <div className="text-center mb-5">
            <h1
              className="fw-bold mb-4"
              style={{ fontSize: "48px", color: "#333" }}>
              Privacy Policy
            </h1>
          </div>
          <Alert variant="warning" className="text-center">
            <h5 className="alert-heading">⚠️ {error}</h5>
            <p className="mb-0" style={{ fontSize: "16px" }}>
              Hubungi admin jika Anda memerlukan informasi lebih lanjut.
            </p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold mb-4"
            style={{ fontSize: "48px", color: "#333" }}>
            Privacy Policy
          </h1>
          {updatedAt && (
            <p style={{ fontSize: "16px", color: "#666" }}>
              Terakhir diperbarui:{" "}
              <span className="fw-bold" style={{ color: "#333" }}>
                {updatedAt}
              </span>
            </p>
          )}
        </div>

        {/* Content from API */}
        <div className="mb-5">
          <div
            style={{
              fontSize: "16px",
              color: "#666",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
            }}>
            {privacyContent}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PolicyContent;
