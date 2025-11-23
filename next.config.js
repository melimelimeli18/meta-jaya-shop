/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
