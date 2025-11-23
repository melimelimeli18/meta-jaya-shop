// File: src/middleware.ts
// Middleware untuk protect admin routes

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /admin
  if (pathname.startsWith("/admin")) {
    // Skip login page itself
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Get token from cookie or we'll check in client side
    // For now, let client-side handle it
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which paths should be checked by middleware
export const config = {
  matcher: ["/admin/:path*"],
};
