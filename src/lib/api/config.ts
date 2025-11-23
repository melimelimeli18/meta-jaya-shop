// src/lib/api/config.ts

/**
 * API Configuration
 * Centralized API URL management
 */

export const API_CONFIG = {
  // Express Backend API Base URL
  EXPRESS_API_URL: process.env.NEXT_PUBLIC_EXPRESS_API_URL,

  // Next.js API Routes Base URL
  NEXT_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
};

/**
 * Get full API endpoint URL
 */
export const getApiUrl = (endpoint: string, useExpress = false) => {
  const baseUrl = useExpress
    ? API_CONFIG.EXPRESS_API_URL
    : API_CONFIG.NEXT_API_URL;
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};
