"use client";

import React from "react";
import Button from "react-bootstrap/Button";
import Link from "next/link";

interface FilledButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const FilledButton: React.FC<FilledButtonProps> = ({
  label,
  href,
  onClick,
  type = "button",
  className = "",
}) => {
  // Jika href ada → jadikan Link
  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <Button
          type={type}
          className={`px-5 py-4 rounded-pill fw-semibold border-0 ${className}`}
          style={{ backgroundColor: "#468386" }}>
          {label}
        </Button>
      </Link>
    );
  }

  // Jika tidak ada href → tombol biasa
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-pill fw-semibold border-0 ${className}`}
      style={{ backgroundColor: "#468386" }}>
      {label}
    </Button>
  );
};

export default FilledButton;
