// File: src/app/admin/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Auth checking - redirect jika sudah login
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      // Verify token dulu
      verifyToken(token);
    }
  }, [router]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Token valid, redirect ke catalog
        router.push("/admin/catalog");
      } else {
        // Token invalid, hapus dari localStorage
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_email");
      }
    } catch (err) {
      console.error("Token verification error:", err);
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_email");
    }
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi input
    if (!email || !password) {
      setError("Email dan password harus diisi!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.data?.token) {
        // Login berhasil
        console.log("Login berhasil!");

        // Simpan token dan email
        localStorage.setItem("admin_token", result.data.token);
        localStorage.setItem("admin_email", result.data.admin.email);

        // Redirect ke catalog
        router.push("/admin/catalog");
      } else {
        // Login gagal
        setError(result.message || "Email atau password salah!");
        console.log("Login gagal:", result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "2rem", padding: "2rem" }}>
              {/* Logo */}
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    padding: "1.5rem",
                  }}>
                  <Image
                    src="/images/MetaJaya.png"
                    alt="MetaJaya Logo"
                    width={100}
                    height={100}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    priority
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center fw-bold mb-4">Login Dashboard</h1>

              {/* Form Login */}
              <div>
                {/* Input Email */}
                <div className="mb-3 position-relative">
                  <span
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      zIndex: 10,
                    }}>
                    👤
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    style={{
                      borderRadius: "50px",
                      padding: "0.75rem 1rem 0.75rem 3rem",
                      border: "2px solid #dee2e6",
                    }}
                  />
                </div>

                {/* Input Password */}
                <div className="mb-4 position-relative">
                  <span
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      zIndex: 10,
                    }}>
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={{
                      borderRadius: "50px",
                      padding: "0.75rem 3rem 0.75rem 3rem",
                      border: "2px solid #dee2e6",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="position-absolute btn btn-link"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      textDecoration: "none",
                      padding: "0",
                      border: "none",
                    }}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                {/* Button Login */}
                <div className="text-center">
                  {/* Error Message */}
                  {error && (
                    <div
                      className="alert alert-danger mb-3"
                      style={{ borderRadius: "15px", fontSize: "14px" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn"
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? "#6c757d" : "#468386",
                      color: "white",
                      borderRadius: "50px",
                      padding: "0.75rem 3rem",
                      fontWeight: "600",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}>
                    {loading ? "Loading..." : "Login"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
