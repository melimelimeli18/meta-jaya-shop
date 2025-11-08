"use client";

import React from "react";
import Link from "next/link";

interface OutlineButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  label,
  href,
  onClick,
  className = "",
  type = "button",
}) => {
  const [isHover, setIsHover] = React.useState(false);

  const style: React.CSSProperties = {
    border: "1.5px solid #468386",
    backgroundColor: isHover ? "rgba(70, 131, 134, 0.1)" : "transparent",
    color: "#468386",
    fontSize: "16px",
    fontWeight: 500,
    padding: "12px 24px",
    borderRadius: "50px",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
  };

  const Component = href ? Link : "button";

  return (
    <Component
      href={href || "#"}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={className}
      style={style}
      {...(Component === "button" ? { type } : {})}>
      {label}
    </Component>
  );
};

export default OutlineButton;
