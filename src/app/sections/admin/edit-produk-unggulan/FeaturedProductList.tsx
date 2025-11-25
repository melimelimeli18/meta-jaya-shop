import React from "react";
import type { Product } from "@/src/types/product"; // Import shared type

interface FeaturedProductListProps {
  products: Product[];
  onToggleFeatured: (id: string) => void; // Change from number to string
}

export default function FeaturedProductList({
  products,
  onToggleFeatured,
}: FeaturedProductListProps) {
  return (
    <div className="list-group">
      {products.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>Tidak ada produk ditemukan</p>
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div className="form-check d-flex align-items-center gap-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={product.isFeatured}
                onChange={() => onToggleFeatured(product.id)}
                id={`product-${product.id}`}
              />
              <label
                className="form-check-label"
                htmlFor={`product-${product.id}`}
                style={{ cursor: "pointer" }}>
                <div>
                  <strong>{product.name}</strong>
                  {product.category && (
                    <span className="badge bg-secondary ms-2">
                      {product.category}
                    </span>
                  )}
                  <div className="text-muted small">{product.price}</div>
                </div>
              </label>
            </div>
            {product.isFeatured && (
              <span className="badge bg-success">⭐ Unggulan</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
