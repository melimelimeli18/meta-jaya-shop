'use client';

import React from 'react';

interface FeaturedProductFormProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  featuredCount: number;
}

const FeaturedProductForm: React.FC<FeaturedProductFormProps> = ({
  searchTerm,
  onSearchChange,
  featuredCount
}) => {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="flex-grow-1 me-3">
          <div className="position-relative">
            <span 
              className="position-absolute" 
              style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            >
              🔍
            </span>
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ 
                borderRadius: "25px", 
                borderColor: "#468386",
                padding: "10px 15px 10px 40px"
              }}
            />
          </div>
        </div>
        
        <div className="text-end">
          <span className="badge" style={{ backgroundColor: "#468386", fontSize: "14px", padding: "8px 16px" }}>
            {featuredCount} Produk Unggulan
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductForm;