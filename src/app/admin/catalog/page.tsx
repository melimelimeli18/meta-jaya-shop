'use client';

import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import ProductModal from '@/src/app/components/admin/ProductModal';
import DeleteModal from '@/src/app/components/admin/DeleteModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/app/context/AuthContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: string;
  variant: string;
  sold: string;
  image: string;
  description: string;
  link: string;
}

// data dummy - nanti ambil dari API atau database
const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    category: "Stand",
    price: "Rp350.000",
    stock: "50",
    variant: "Merah, Biru, Hitam",
    sold: "50 Terjual",
    image: "/images/placeholder.png",
    description: "Spek 3\" 850W",
    link: "https://shopee.com/product/1"
  },
  {
    id: 2,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    category: "Stand",
    price: "Rp350.000",
    stock: "50",
    variant: "Putih, Hitam",
    sold: "50 Terjual",
    image: "/images/placeholder.png",
    description: "Spek 3\" 850W",
    link: "https://shopee.com/product/2"
  },
  {
    id: 3,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    category: "Stand",
    price: "Rp350.000",
    stock: "50",
    variant: "Silver, Gold",
    sold: "50 Terjual",
    image: "/images/placeholder.png",
    description: "Spek 3\" 850W",
    link: "https://shopee.com/product/3"
  },
  {
    id: 4,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    category: "Microphone",
    price: "Rp350.000",
    stock: "50",
    variant: "Wireless",
    sold: "50 Terjual",
    image: "/images/placeholder.png",
    description: "Spek 3\" 850W",
    link: "https://shopee.com/product/4"
  },
  {
    id: 5,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    category: "Power Amplifier",
    price: "Rp350.000",
    stock: "50",
    variant: "1000W, 2000W",
    sold: "50 Terjual",
    image: "/images/placeholder.png",
    description: "Spek 3\" 850W",
    link: "https://shopee.com/product/5"
  },
  {
    id: 6,
    name: "Tweeter / Driver Speaker RCF N850 Magnet Besar",
    category: "Kit Power/ Modul Speaker",
    price: "Rp350.000",
    stock: "50",
    variant: "6 Inch, 8 Inch",
    sold: "50 Terjual",
    image: "/images/placeholder.png",
    description: "Spek 3\" 850W",
    link: "https://shopee.com/product/6"
  }
];



export default function AdminCatalogPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push('/admin/login');
      }
    }
  }, [user, isLoading, isAdmin, router]);

  // seacth
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleSubmitProduct = (data: {
    name: string;
    price: string;
    variant: string;
    link: string;
    description: string;
    category: string;
    image?: string | File;
  }) => {
    if (currentProduct) {
      setProducts(products.map(p => 
        p.id === currentProduct.id 
          ? { 
              ...p, 
              name: data.name,
              price: data.price,
              variant: data.variant,
              link: data.link,
              description: data.description,
              category: data.category,
              image: typeof data.image === 'string' 
                ? data.image 
                : data.image 
                  ? URL.createObjectURL(data.image) 
                  : p.image
            }
          : p
      ));
    } else {
      // tambah produk
      const newProduct: Product = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: data.name,
        category: data.category || "Stand",
        price: data.price,
        stock: "50",
        variant: data.variant,
        sold: "0 Terjual",
        image: data.image 
          ? (typeof data.image === 'string' 
              ? data.image 
              : URL.createObjectURL(data.image)) 
          : '/images/placeholder.png',
        description: data.description,
        link: data.link
      };
      setProducts([...products, newProduct]);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-4">
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
              placeholder="Cari barang"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                borderRadius: "25px", 
                borderColor: "#468386",
                padding: "10px 15px 10px 40px"
              }}
            />
          </div>
        </div>

        <div className="col-md-4 text-center">
          <h2 className="fw-bold mb-0">Katalog MetaJayaShop</h2>
        </div>

        <div className="col-md-4 text-end">
          <button
            className="btn"
            style={{ 
              backgroundColor: "#468386", 
              color: "white",
              borderRadius: "20px",
              padding: "10px 30px"
            }}
            onClick={handleAddProduct}
          >
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-md-4">
            <div className="card h-100 shadow-sm border-0 rounded-4 position-relative">
              <button
                onClick={() => handleDeleteClick(product.id)}
                className="position-absolute top-0 end-0 m-2 btn btn-sm btn-danger rounded-circle"
                style={{ 
                  width: "32px", 
                  height: "32px", 
                  padding: 0,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none"
                }}
              >
                ×
              </button>

              <div className="position-relative">
                <span 
                  className="position-absolute top-0 start-0 m-2 badge bg-light text-dark"
                  style={{ fontSize: "10px" }}
                >
                  {product.category}
                </span>
                <span 
                  className="position-absolute top-0 start-50 translate-middle-x m-2 badge bg-light text-dark"
                  style={{ fontSize: "10px" }}
                >
                  Spek 3&quot; 850W
                </span>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                style={{ 
                  height: "200px", 
                  objectFit: "cover",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem"
                }}
              />

              <div className="card-body text-center">
                <h6 className="card-title fw-semibold mb-3">
                  {product.name}
                </h6>

                <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                  <span className="fw-bold">{product.price}</span>
                  <span className="text-warning">⭐ {product.stock}</span>
                  <span className="text-muted" style={{ fontSize: "14px" }}>
                    {product.sold}
                  </span>
                </div>

                <button
                  className="btn w-100"
                  style={{ 
                    backgroundColor: "white",
                    color: "#468386",
                    border: "2px solid #468386",
                    borderRadius: "20px",
                    padding: "8px"
                  }}
                  onClick={() => handleEditProduct(product)}
                >
                  Edit Produk
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? "Edit Produk" : "Tambah Produk"}
        onSubmit={handleSubmitProduct}
        initialData={currentProduct}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}