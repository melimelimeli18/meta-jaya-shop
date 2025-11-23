// File: src/app/components/admin/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LogoutButton({
  className = "",
  style,
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      // Optional: Call logout API
      if (token) {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        await fetch(`${API_URL}/api/admin/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_email");

      // Redirect to login page
      router.push("/admin/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "btn btn-danger"}
      style={style}>
      Logout
    </button>
  );
}
