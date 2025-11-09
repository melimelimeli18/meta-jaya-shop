'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'next/image';
import { useAuth } from '@/src/app/context/AuthContext';

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Login dengan Supabase Auth
      await login(email, password);
      // Redirect akan otomatis dari AuthContext
    } catch (err) {
      // Tampilkan error message
      setError(err instanceof Error ? err.message : 'Email atau password salah!');
      console.log('Login gagal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading saat checking auth
  if (isLoading) {
    return (
      <div 
        className="d-flex align-items-center justify-content-center"
        style={{ 
          minHeight: "100vh", 
          backgroundColor: "#f8f9fa" 
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="d-flex align-items-center justify-content-center"
      style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa" 
      }}
    >
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div 
              className="card border-0 shadow-lg"
              style={{ borderRadius: "2rem", padding: "2rem" }}
            >
              {/* Logo */}
              <div className="text-center mb-4">
                <div 
                  className="d-inline-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    padding: "1.5rem"
                  }}
                >
                  <Image 
                    src="/images/MetaJaya.png" 
                    alt="MetaJaya Logo"
                    width={100}
                    height={100}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain" 
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
                      left: '15px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6c757d',
                      zIndex: 10 
                    }}
                  >
                    👤
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      borderRadius: "50px",
                      padding: "0.75rem 1rem 0.75rem 3rem",
                      border: "2px solid #dee2e6"
                    }}
                  />
                </div>

                {/* Input Password */}
                <div className="mb-4 position-relative">
                  <span 
                    className="position-absolute" 
                    style={{ 
                      left: '15px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6c757d',
                      zIndex: 10 
                    }}
                  >
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      borderRadius: "50px",
                      padding: "0.75rem 3rem 0.75rem 3rem",
                      border: "2px solid #dee2e6"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute btn btn-link"
                    disabled={isSubmitting}
                    style={{ 
                      right: '10px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#6c757d',
                      textDecoration: 'none',
                      padding: '0',
                      border: 'none'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {/* Button Login */}
                <div className="text-center">
                  {/* Error Message */}
                  {error && (
                    <div 
                      className="alert alert-danger mb-3" 
                      style={{ borderRadius: "15px", fontSize: "14px" }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn"
                    onClick={handleLogin}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: "#468386",
                      color: "white",
                      borderRadius: "50px",
                      padding: "0.75rem 3rem",
                      fontWeight: "600",
                      border: "none",
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>

                  {/* Info credentials */}
                  <div className="mt-3 text-muted" style={{ fontSize: "12px" }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}