'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah login
    const isLoggedIn = localStorage.getItem('adminToken'); // atau cara auth kamu
    
    if (isLoggedIn) {
      router.push('/admin/catalog'); // Kalau udah login, ke catalog
    } else {
      router.push('/admin/login');   // Kalau belum login, ke login
    }
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <p>Loading...</p>
    </div>
  );
}