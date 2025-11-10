'use client';

import React from 'react';

interface ProductFormProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <div className="d-flex gap-3 mb-4">
      <div className="flex-grow-1">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Cari barang"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ borderRadius: "20px", borderColor: "#468386" }}
        />
      </div>
    </div>
  );
};

export default ProductForm;