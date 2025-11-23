// src/app/components/user/FavoriteModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ isOpen, onClose }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem("metajaya_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const removeFavorite = (id: string) => {
    try {
      const stored = localStorage.getItem("metajaya_favorites");
      if (stored) {
        const currentFavorites: FavoriteProduct[] = JSON.parse(stored);
        const updated = currentFavorites.filter((item) => item.id !== id);
        localStorage.setItem("metajaya_favorites", JSON.stringify(updated));
        setFavorites(updated);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}>
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Header */}
        <div
          className="flex justify-between items-center mb-4"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}>
          <h2
            className="text-2xl font-bold"
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
            }}>
            Favorit Saya
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#999",
              lineHeight: "1",
              padding: "0",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            ×
          </button>
        </div>

        {/* List Items */}
        <div
          className="overflow-y-auto"
          style={{
            overflowY: "auto",
            flex: 1,
          }}>
          {favorites.length === 0 ? (
            <div
              className="text-center py-8 text-gray-500"
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#999",
              }}>
              <p>Belum ada produk favorit</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}>
                  {/* Image */}
                  <Link
                    href={`/product/${item.id}`}
                    onClick={onClose}
                    style={{
                      flexShrink: 0,
                    }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded"
                      unoptimized
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div
                    className="flex-1 min-w-0"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}>
                    <Link
                      href={`/product/${item.id}`}
                      onClick={onClose}
                      style={{
                        textDecoration: "none",
                      }}>
                      <h3
                        className="font-medium text-sm line-clamp-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#333",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: "1.4",
                          margin: 0,
                        }}>
                        {item.name}
                      </h3>
                    </Link>
                    <p
                      className="text-gray-500 text-sm"
                      style={{
                        fontSize: "13px",
                        color: "#999",
                        margin: 0,
                      }}>
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="text-red-500 hover:text-red-700"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#ef4444",
                      padding: "4px 8px",
                      flexShrink: 0,
                    }}
                    title="Hapus dari favorit">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;
