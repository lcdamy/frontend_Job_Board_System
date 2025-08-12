import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: ['cdn-icons-png.flaticon.com', 'rci-files.lon1.digitaloceanspaces.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
