'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardRoot from '../components/admin/DashboardRoot';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // COMMENT DULU AUTH CHECKING
  /*
  useEffect(() => {
    const router = useRouter();
    
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('admin_token');
    
    // Redirect to login if no token
    if (!token) {
      router.push('/admin/login');
    }
  }, [pathname]);
  */

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <DashboardRoot>{children}</DashboardRoot>;
}