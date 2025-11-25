/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vxsivwdmvwxpprujdhpi.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Alternative: use domains (deprecated but still works)
    // domains: ['vxsivwdmvwxpprujdhpi.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig;
