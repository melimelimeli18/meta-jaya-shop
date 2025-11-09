'use client'

import { useAuth } from '@/src/app/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return
    }

    // Redirect to login if not authenticated or not admin
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isAdmin, isLoading, pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page without guard
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show protected content only if authenticated and admin
  if (isAuthenticated && isAdmin) {
    return <>{children}</>
  }

  return null
}