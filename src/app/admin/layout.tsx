// File: src/app/admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import DashboardRoot from "../components/admin/DashboardRoot";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        // Redirect to login if no token
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/admin/login");
          return;
        }

        // Verify token with backend
        const response = await fetch(`${API_URL}/api/admin/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          console.log("Token valid, user authenticated");
          setIsAuthenticated(true);
        } else {
          console.log("Token invalid:", result.message);
          // Token invalid, remove and redirect
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_email");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_email");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [pathname, router, API_URL]);

  // Loading state
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If login page, render without DashboardRoot
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated and not loading, don't render
  if (!isAuthenticated) {
    return null;
  }

  // Render with DashboardRoot for authenticated admin pages
  return <DashboardRoot>{children}</DashboardRoot>;
}
