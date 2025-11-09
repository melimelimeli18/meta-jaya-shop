'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FeaturedProductForm from '@/src/app/sections/admin/edit-produk-unggulan/FeaturedProductForm';
import FeaturedProductList from '@/src/app/sections/admin/edit-produk-unggulan/FeaturedProductList';

interface Product {
  id: number;
  name: string;
  price: string;
  isFeatured: boolean;
}

// data dummy
const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    price: "Rp350.000",
    isFeatured: false
  },
  {
    id: 2,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    price: "Rp350.000",
    isFeatured: true
  },
  {
    id: 3,
    name: "Microphone Wireless Professional",
    price: "Rp450.000",
    isFeatured: false
  },
  {
    id: 4,
    name: "Power Amplifier 1000W",
    price: "Rp2.500.000",
    isFeatured: false
  },
  {
    id: 5,
    name: "Speaker Component 6 Inch",
    price: "Rp750.000",
    isFeatured: true
  },
  {
    id: 6,
    name: "Mixer Audio Digital 16 Channel",
    price: "Rp3.500.000",
    isFeatured: false
  },
  {
    id: 7,
    name: "Subwoofer Active 18 Inch",
    price: "Rp5.000.000",
    isFeatured: false
  },
  {
    id: 8,
    name: "Wireless Microphone Dual Channel",
    price: "Rp850.000",
    isFeatured: true
  },
  {
    id: 9,
    name: "Studio Monitor Speaker 8 Inch",
    price: "Rp4.200.000",
    isFeatured: false
  },
  {
    id: 10,
    name: "Audio Interface USB 4 Channel",
    price: "Rp2.800.000",
    isFeatured: false
  }
];

const MAX_FEATURED = 3;

export default function EditProdukUnggulanPage() {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");

  // search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredCount = products.filter(p => p.isFeatured).length;

  const handleToggleFeatured = (id: number) => {
    const product = products.find(p => p.id === id);
    
    if (!product) return;

    if (!product.isFeatured) {
      if (featuredCount >= MAX_FEATURED) {
        alert(`Maksimal hanya ${MAX_FEATURED} produk yang bisa dijadikan unggulan!`);
        return;
      }
    }

    setProducts(products.map(p =>
      p.id === id
        ? { ...p, isFeatured: !p.isFeatured }
        : p
    ));
    
    console.log('Toggling featured status for product:', id);
  };

  return (
    <Container fluid className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="fw-bold mb-4 text-center">Produk Unggulan</h2>
          
          <FeaturedProductForm
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            featuredCount={featuredCount}
          />

          <FeaturedProductList
            products={filteredProducts}
            onToggleFeatured={handleToggleFeatured}
          />

          <div className="bg-light rounded-3 p-3 mt-4 text-center">
            <small className="text-muted">
              <strong>💡 Tips:</strong> Maksimal {MAX_FEATURED} produk yang bisa dijadikan unggulan. 
              Centang checkbox untuk menampilkan produk di halaman utama sebagai produk unggulan.
              Produk yang dicentang akan muncul di section &quot;Produk Unggulan&quot; pada halaman user.
            </small>
          </div>

          {featuredCount >= MAX_FEATURED && (
            <div className="alert alert-warning text-center mt-3" role="alert">
              ⚠️ Sudah mencapai batas maksimal {MAX_FEATURED} produk unggulan. 
              Hapus centang salah satu produk untuk menambah yang lain.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}