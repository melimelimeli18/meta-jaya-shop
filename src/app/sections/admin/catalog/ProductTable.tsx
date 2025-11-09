'use client';

import React from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: string;
  sold: string;
  image: string;
  description: string;
  link: string;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>Nama Produk</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Terjual</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>⭐ {product.stock}</td>
              <td>{product.sold}</td>
              <td>
                <button
                  className="btn btn-sm me-2"
                  style={{ 
                    backgroundColor: "#468386", 
                    color: "white",
                    borderRadius: "20px",
                    padding: "4px 16px"
                  }}
                  onClick={() => onEdit(product)}
                >
                  Edit Produk
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  style={{ 
                    borderRadius: "20px",
                    padding: "4px 16px"
                  }}
                  onClick={() => onDelete(product.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;