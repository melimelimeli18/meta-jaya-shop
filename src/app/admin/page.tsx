// File: src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          // Tidak ada token, redirect ke login
          router.push("/admin/login");
          return;
        }

        // Verify token dengan backend
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
          // Token invalid, hapus dan redirect ke login
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_email");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Error, redirect ke login
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_email");
        router.push("/admin/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, API_URL]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="text-center">
        {isChecking ? (
          <>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Checking authentication...</p>
          </>
        ) : (
          <p className="text-muted">Redirecting...</p>
        )}
      </div>
    </div>
  );
}
