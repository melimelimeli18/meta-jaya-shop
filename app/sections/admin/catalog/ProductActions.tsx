'use client';

import React from 'react';

interface ProductActionsProps {
  onAddProduct: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ onAddProduct }) => {
  return (
    <div className="mb-4">
      <button
        className="btn"
        style={{ 
          backgroundColor: "#468386", 
          color: "white",
          borderRadius: "20px",
          padding: "8px 24px"
        }}
        onClick={onAddProduct}
      >
        Tambah Produk
      </button>
    </div>
  );
};

export default ProductActions;