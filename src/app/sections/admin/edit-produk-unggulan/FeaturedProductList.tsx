'use client';

import React from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
  isFeatured: boolean;
}

interface FeaturedProductListProps {
  products: Product[];
  onToggleFeatured: (id: number) => void;
}

const FeaturedProductList: React.FC<FeaturedProductListProps> = ({ 
  products, 
  onToggleFeatured 
}) => {
  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <div className="d-flex flex-column gap-3">
        {products.map((product) => (
          <div 
            key={product.id}
            className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3"
          >
            <div>
              <h6 className="mb-1 fw-semibold">{product.name}</h6>
              <p className="mb-0 text-muted small">{product.price}</p>
            </div>
            
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`featured-${product.id}`}
                checked={product.isFeatured}
                onChange={() => onToggleFeatured(product.id)}
                style={{ 
                  width: "24px", 
                  height: "24px",
                  cursor: "pointer",
                  borderColor: "#468386"
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductList;